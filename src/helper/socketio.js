import { io } from "socket.io-client";
import {
  RtcReceive,
  RtcSender,
  RtcSetAnswer,
  RtcSetIce_candidate,
} from "./RtcPeer";
import { getAudioStream, getVideoStream } from "./userMedia";

export const initiate_Socket_Connection = async (payload) => {
  !window.VideoStream && (await getVideoStream());
  !window.AudioStream && (await getAudioStream());
  window.socket = io.connect(process.env.REACT_APP_SERVER_ENDPOINT);
  window.socket.emit("join_meet", payload);
  window.socket.on("new_member_connect", (data) => console.log(data));
  window.socket.on("send_offer", (data) => {
    data.MeetParticipant.map((participant) => {
      return RtcSender({ id: participant });
    });
  });
  window.socket.on("offer", (data) => {
    RtcReceive({ offer: data.offer, memberId: data.memberId });
  });
  window.socket.on("answer", (data) => {
    RtcSetAnswer(data);
  });
  window.socket.on("ice_candidate", (data) => {
    RtcSetIce_candidate(data);
  });
};

export const send_offer = (payload) => {
  window.socket.emit("offer", payload);
};

export const send_ice_candidate = (payload) => {
  window.socket.emit("ice_candidate", payload);
};

export const send_answer = (payload) => {
  window.socket.emit("answer", payload);
};
