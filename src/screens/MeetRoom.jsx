import { initiate_Socket_Connection } from 'helper/socketio';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import MR from "../css/MeetRoom.module.css";

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
        <div className={MR.Container}>
            <div id="clientVideoHolder" className={MR.VideoContainer}>
                <video muted autoPlay ref={myVideo}></video>
            </div>
        </div>
    );
};


export default MeetRoom;