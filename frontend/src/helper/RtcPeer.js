//for RtcPeerConnection
export const RtcSender = async (person) => {
  const peer = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.stunprotocol.org" },
      {
        urls: process.env.REACT_APP_STUN_URL,
        credential: process.env.REACT_APP_STUN_URL_PASSWORD,
        username: process.env.REACT_APP_STUN_USERNAME,
      },
    ],
  });
  await window.VideoStream.getTracks().forEach((track) => {
    peer.addTrack(track, window.VideoStream);
  });
  await window.AudioStream.getTracks().forEach((track) => {
    peer.addTrack(track, window.AudioStream);
  });
  window.Peer = peer;
  peer.onicecandidate = (e) => {
    const payload = {
      memberId: person.id,
      ice_candidate: JSON.stringify(e.candidate),
    };
    window.socket.emit("ice_candidate", payload);
  };
  peer.onconnectionstatechange = (ev) => {
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
  peer.oniceconnectionstatechange = function (event) {
    if (
      peer.iceConnectionState === "failed" ||
      peer.iceConnectionState === "disconnected" ||
      peer.iceConnectionState === "closed"
    ) {
      peer.restartIce();
    }
  };
  peer.ontrack = async (e) => {
    console.log(e.track);
    // document.getElementById("ClintVideoTag").srcObject =
    //   window.remoteStream_[person.id];
  };
  peer.onnegotiationneeded = (e) => {
    peer
      .createOffer()
      .then((offer) => {
        return peer.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          memberId: person.id,
          offer: peer.localDescription,
        };
        window.socket.emit("offer", payload);
      })
      .catch((error) =>
        console.error({ message: "WebRTC localDescription error", error })
      );
  };
};

//for RtcPeerConnection clint
export const RtcReceive = ({ memberId, offer }) => {
  return new Promise(async (resolve) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.stunprotocol.org" },
        {
          urls: process.env.REACT_APP_STUN_URL,
          credential: process.env.REACT_APP_STUN_URL_PASSWORD,
          username: process.env.REACT_APP_STUN_USERNAME,
        },
      ],
    });
    await window.VideoStream.getTracks().forEach((track) => {
      peer.addTrack(track, window.VideoStream);
    });
    await window.AudioStream.getTracks().forEach((track) => {
      peer.addTrack(track, window.AudioStream);
    });
    window.Peer = peer;
    peer.onconnectionstatechange = (ev) => {
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
    peer.oniceconnectionstatechange = function (event) {
      if (
        peer.iceConnectionState === "failed" ||
        peer.iceConnectionState === "disconnected" ||
        peer.iceConnectionState === "closed"
      ) {
        peer.restartIce();
      }
    };
    peer.onicecandidate = (e) => {
      const payload = {
        memberId: memberId,
        ice_candidate: JSON.stringify(e.candidate),
      };
      window.socket.emit("ice_candidate", payload);
    };
    peer.ontrack = async (e) => {
      console.log(e.track);
    };
    peer.setRemoteDescription(offer).then((e) => {});
    peer
      .createAnswer()
      .then((answer) => peer.setLocalDescription(answer))
      .then((e) => {
        const payload = {
          memberId: memberId,
          answer: peer.localDescription,
        };
        window.socket.emit("answer", payload);
        window.Peer = peer;
        resolve(peer);
      })
      .catch((error) =>
        console.error({ message: "WebRTC localDescription error", error })
      );
  });
};

//for RtcPeerConnection clint
export const RtcSetAnswer = ({ answer }) => {
  window.Peer.setRemoteDescription(answer).then((e) => {});
};

//for Set Ice_candidate
export const RtcSetIce_candidate = ({ Ice_candidate }) => {
  window.Peer &&
    window.Peer.addIceCandidate(JSON.parse(Ice_candidate)).catch((error) =>
      console.log("ERROR Ice_candidate: ", error.message)
    );
};
