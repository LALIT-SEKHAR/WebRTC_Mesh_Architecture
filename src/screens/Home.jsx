import React, { useRef, useState } from 'react';
import { getAudioStream, getVideoStream } from 'helper/userMedia';
import { Link } from 'react-router-dom';
import { v1 as uuid } from "uuid";

const Home = () => {

    const MeetId = useRef(uuid())

    const VideoTag = useRef()

    const [IsMeetCreated, setIsMeetCreated] = useState(false)
    
    const InitiateMeet = async () => {
        const UserVideoStream = await getVideoStream();
        VideoTag.current.srcObject = UserVideoStream;
        const UserAudioStream = await getAudioStream()
        const audio = new Audio()
        audio.srcObject = UserAudioStream;
        audio.play()
        setIsMeetCreated(true)
    }

    return (
        <div>
            <h1>Home</h1>
            <button onClick={InitiateMeet}>Start Meet</button>
            {IsMeetCreated && <Link to={`/${MeetId.current}`}><button id="enterRoom">Enter Room</button></Link>}
            <video height="500" ref={VideoTag} autoPlay muted></video>
        </div>
    );
};

export default Home;