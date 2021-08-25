import { initiate_Socket_Connection } from 'helper/socketio';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const MeetRoom = () => {

    const {MeetId} = useParams();
    const myVideo = useRef();

    useEffect(()=>{
        init()
    })

    const init = async () => {
        await initiate_Socket_Connection({MeetId})
        myVideo.current.srcObject = window.VideoStream
    }

    return (
        <div >
            {/* <h1>{MeetId}</h1>  */}
            <div id="clientVideoHolder">
                <video height="500" muted autoPlay ref={myVideo}></video>
            </div>
        </div>
    );
};


export default MeetRoom;