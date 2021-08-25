export const getVideoStream = () => {
  return navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      window.VideoStream = stream;
      return stream;
    })
    .catch((error) => alert(error.message));
};

export const getAudioStream = () => {
  return navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      window.AudioStream = stream;
      return stream;
    })
    .catch((error) => alert(error.message));
};
