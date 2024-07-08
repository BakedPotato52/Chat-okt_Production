import React, { useState, useEffect, useRef } from 'react';
import { Button, Avatar, Typography, InputAdornment, IconButton, FormControl, CircularProgress, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusIcon, SearchIcon } from './Icons';
import ChatLoading from './ChatLoader';
import GroupModal from './Modals/GroupModal';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import { getSender } from '../config/ChatLogics';
import { Textarea } from '@mui/joy';
import ChatHeader from './ChatHeader';
import { useNavigate } from 'react-router-dom';

function Sidebar({ fetchAgain }) {
    const searchInputRef = useRef(null);
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/chat', config);
            setChats(data);
            console.log(data)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setLoggedUser(userInfo);

        if (userInfo && userInfo.token) {
            fetchChats();
        } else {
            toast.error('User is not logged in', {
                position: 'bottom-left',
                autoClose: 5000
            });
        }
        // eslint-disable-next-line
    }, [fetchAgain]);

    const handleSearch = async (query) => {
        setSearch(query);
        console.log(query);
        if (!query) {
            setSearchResult([]);
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setLoading(false);
            setSearchResult(data);
            console.log(data);
        } catch (error) {
            toast.error("Failed to Load the Search Results", { position: "bottom-left" });
            setLoading(false);
        }
    };

    const handleChat = async (userId) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post('/api/chat', { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            console.log(data);
            navigate('/chats');
        } catch (error) {
            toast.error("Failed to start the chat", { position: "bottom-left" });
        }
    };

    return (
        <>
            <div className='flex flex-row'>

                <ChatHeader />
                <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Chats</h2>
                        <GroupModal>
                            <Button variant="ghost" size="icon">
                                <PlusIcon className="h-5 w-5" />
                            </Button>
                        </GroupModal>
                    </div>
                    <div className="flex items-center justify-center p-4">
                        <FormControl fullWidth margin="normal">
                            <Textarea
                                placeholder="Search"
                                className="rounded-full px-8 py-2 text-sm"
                                onChange={(e) => handleSearch(e.target.value)}
                                inputprops={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton>
                                                <SearchIcon className="text-gray-400" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                ref={searchInputRef}
                            />
                        </FormControl>
                    </div>
                    <div className="flex-grow overflow-y-auto h-[calc(100vh-128px)] px-4 space-y-4">
                        {search ? (
                            searchResult.map((user) => (
                                loading ? (
                                    <Box key={user._id} display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <CircularProgress size={40} />
                                    </Box>
                                ) : (
                                    <div
                                        key={user._id}
                                        className="flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                                        onClick={() => handleChat(user._id)}
                                    >
                                        <Avatar src={user.pic} className="h-10 w-10" />
                                        <div>
                                            <h3 className="font-semibold">{user.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                )
                            ))
                        ) : chats ? (
                            <div className="overflow-y-scroll">

                                {chats.map((chat) => (
                                    <div
                                        key={chat._id}
                                        className={`flex items-center gap-4 p-4 rounded-lg transition-colors cursor-pointer ${selectedChat === chat ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'}`}
                                        onClick={() => setSelectedChat(chat)}
                                    >
                                        <Avatar className="h-10 w-10" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">
                                                {chat.name}
                                                {getSender(loggedUser, chat.users)}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {chat.latestMessage && (
                                                    <Typography variant="body2">
                                                        <b>{chat.latestMessage.sender.name}:</b> {chat.latestMessage.content.length > 50 ? chat.latestMessage.content.substring(0, 51) + '...' : chat.latestMessage.content}
                                                    </Typography>
                                                )}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">2h</span>
                                    </div>
                                ))}
                            </div>

                        ) : (
                            <ChatLoading />
                        )}
                    </div>
                </div>
                <ToastContainer />
            </div>

        </>
    );
}

export default Sidebar;
