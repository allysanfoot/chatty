import React, { useContext, useEffect, useState } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthenticationContext } from '../context/AuthenticationContext'
import { ChatContext } from '../context/ChatContext'

const Convos = () => {

    const [chats, setChats] = useState([])
    const {currentUser} = useContext(AuthenticationContext)
    const {dispatch} = useContext(ChatContext)

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data())
            });

            return () => {
                unsub();
            };
        };

            currentUser.uid && getChats()
        }, [currentUser.uid]);

    const handleSelect = (user) => {
        dispatch({type: 'CHANGE_USER', payload: user })
    }
    
    return (
        <div className='convos'>
            {Object.entries(chats)?.sort((a, b) => b[1].lastMessageDate - a[1].lastMessageDate).map((chat) => (
                <div 
                className='userChat' 
                key={chat[0]} 
                onClick={() => handleSelect(chat[1].userInfo)}>
                    <img src={chat[1].userInfo?.photoURL} alt='' />
                    <div className='userChatInfo'>
                        <span>{chat[1].userInfo?.displayName}</span>
                        <p>{chat[1].lastMessage?.text}</p>
                    </div>
                </div>
                ))}
        </div>
    )
}

export default Convos