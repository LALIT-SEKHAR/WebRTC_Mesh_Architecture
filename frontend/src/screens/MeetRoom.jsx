import { initiate_Socket_Connection } from 'helper/socketio';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MeetRoom = () => {

    const {MeetId} = useParams()

    useEffect(()=>{
        initiate_Socket_Connection({MeetId})
    })

    return (
        <div >
            <h1>{MeetId}</h1> 
        </div>
    );
};


export default MeetRoom;