window.RtcPeers = [];

//for RtcPeerConnection
export const RtcSender = async (person) => {
  const peer = createPeer();
  addMediaTracks({ peer });
  window.Peer = peer;
  peer.onicecandidate = (e) => handelOnIceCandidate({ e, memberId: person.id });
  peer.onconnectionstatechange = () => handelOnConnectionStateChange(peer);
  peer.oniceconnectionstatechange = () =>
    handelOnIceConnectionStateChange(peer);
  let memberInfo = {
    id: person.id,
    peer: peer,
    mediaStream: new MediaStream(),
  };
  window.RtcPeers.push(memberInfo);
  window.RtcPeers.forEach((member, index) => {
    if (member.id === person.id) {
      window.RtcPeers[index].peer.ontrack = (e) =>
        handelOnTrack({ e, mediaStream: window.RtcPeers[index].mediaStream });
      window.RtcPeers[index].peer.oniceconnectionstatechange = () =>
        handelOnIceConnectionStateChange(window.RtcPeers[index].peer);
      window.RtcPeers[index].peer.onnegotiationneeded = (e) =>
        handelCreateOffer({
          peer: window.RtcPeers[index].peer,
          memberId: person.id,
        });
    }
  });
};

//for RtcPeerConnection client
export const RtcReceive = ({ memberId, offer }) => {
  return new Promise(async (resolve) => {
    const peer = createPeer();
    addMediaTracks({ peer });
    window.Peer = peer;
    peer.onicecandidate = (e) => handelOnIceCandidate({ e, memberId });
    peer.onconnectionstatechange = () => handelOnConnectionStateChange(peer);
    peer.oniceconnectionstatechange = () => {
      handelOnIceConnectionStateChange(peer);
    };
    let memberInfo = {
      id: memberId,
      peer: peer,
      mediaStream: new MediaStream(),
    };
    window.RtcPeers.push(memberInfo);
    window.RtcPeers.forEach((member, index) => {
      if (member.id === memberId) {
        window.RtcPeers[index].peer.ontrack = (e) =>
          handelOnTrack({ e, mediaStream: window.RtcPeers[index].mediaStream });
        window.RtcPeers[index].peer.oniceconnectionstatechange = () => {
          handelOnIceConnectionStateChange(window.RtcPeers[index].peer);
        };
        window.RtcPeers[index].peer.setRemoteDescription(offer).then((e) => {});
        handelCreateAnswer({ peer: window.RtcPeers[index].peer, memberId });
      }
    });
  });
};

//for RtcPeerConnection clint
export const RtcSetAnswer = (answer) => {
  window.RtcPeers.forEach((member, index) => {
    if (member.id === answer.memberId) {
      window.RtcPeers[index].peer
        .setRemoteDescription(answer.answer)
        .then((e) => {});
    }
  });
};

//for Set Ice_candidate
export const RtcSetIce_candidate = (Ice_candidate) => {
  window.RtcPeers.forEach((member, index) => {
    if (member.id === Ice_candidate.memberId) {
      window.RtcPeers[index].peer
        .addIceCandidate(JSON.parse(Ice_candidate.ice_candidate))
        .catch((error) => console.log("ERROR Ice_candidate: ", error.message));
    }
  });
};

const createPeer = () => {
  return new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.stunprotocol.org" },
      {
        urls: process.env.REACT_APP_STUN_URL,
        credential: process.env.REACT_APP_STUN_URL_PASSWORD,
        username: process.env.REACT_APP_STUN_USERNAME,
      },
    ],
  });
};

const handelCreateOffer = ({ peer, memberId }) => {
  return peer
    .createOffer()
    .then((offer) => {
      return peer.setLocalDescription(offer);
    })
    .then(() => {
      const payload = {
        memberId,
        offer: peer.localDescription,
      };
      window.socket.emit("offer", payload);
    })
    .catch((error) =>
      console.error({ message: "WebRTC localDescription error", error })
    );
};

const handelCreateAnswer = ({ peer, memberId }) => {
  return peer
    .createAnswer()
    .then((answer) => peer.setLocalDescription(answer))
    .then((e) => {
      const payload = {
        memberId,
        answer: peer.localDescription,
      };
      window.socket.emit("answer", payload);
      window.Peer = peer;
    })
    .catch((error) =>
      console.error({ message: "WebRTC localDescription error", error })
    );
};

const handelOnTrack = ({ e, mediaStream }) => {
  mediaStream.addTrack(e.track, mediaStream);
  if (e.track.kind === "video") {
    const videoTagHolder = document.getElementById("clientVideoHolder");
    const videoTag = document.createElement("video");
    videoTagHolder.appendChild(videoTag);
    videoTag.autoplay = true;
    videoTag.muted = true;
    videoTag.autoplay = true;
    videoTag.className = "clientVideo";
    videoTag.srcObject = mediaStream;
  }
};

const addMediaTracks = async ({ peer }) => {
  await window.mediaStream.getTracks().forEach((track) => {
    peer.addTrack(track, window.mediaStream);
  });
};

const handelOnIceCandidate = ({ e, memberId }) => {
  const payload = {
    memberId,
    ice_candidate: JSON.stringify(e.candidate),
  };
  window.socket.emit("ice_candidate", payload);
};

const handelOnConnectionStateChange = (peer) => {
  switch (peer.connectionState) {
    case "connected":
      console.log("connected");
      break;
    case "disconnected":
      window.location.replace("/");
      break;
    default:
      break;
  }
};

const handelOnIceConnectionStateChange = (peer) => {
  if (
    peer.iceConnectionState === "failed" ||
    peer.iceConnectionState === "disconnected" ||
    peer.iceConnectionState === "closed"
  ) {
    peer.restartIce();
  }
};
