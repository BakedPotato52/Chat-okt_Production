import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Avatar, ClickAwayListener, Grow, Paper, Popper,
    MenuItem, MenuList, Stack,
    IconButton,
} from '@mui/material';
import { MessageSquareIcon } from './Icons'
import { FiBell } from "react-icons/fi";
import 'react-toastify/dist/ReactToastify.css';
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './Modals/ProfileModal';

import { getSender } from '../config/ChatLogics';

import avatar from '../avatar.png'; // Assuming you have a placeholder avatar image

function ChatHeader() {
    // useStates for handling notification & profile open
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // useNavigate to navigate through Pages
    const navigate = useNavigate();

    // useRefs for getting the references 
    const notificationAnchorRef = useRef(null);
    const profileAnchorRef = useRef(null);
    const prevNotificationOpen = useRef(notificationOpen);
    const prevProfileOpen = useRef(profileOpen);

    // Provides context 
    const { user, setSelectedChat, notification, setNotification } = ChatState();

    const handleNotificationToggle = () => {
        setNotificationOpen((prevOpen) => !prevOpen);
    };

    const handleProfileToggle = () => {
        setProfileOpen((prevOpen) => !prevOpen);
    };

    const handleNotificationClose = (event) => {
        if (notificationAnchorRef.current && notificationAnchorRef.current.contains(event.target)) {
            return;
        }
        setNotificationOpen(false);
    };

    const handleProfileClose = (event) => {
        if (profileAnchorRef.current && profileAnchorRef.current.contains(event.target)) {
            return;
        }
        setProfileOpen(false);
    };

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setNotificationOpen(false);
            setProfileOpen(false);
        } else if (event.key === 'Escape') {
            setNotificationOpen(false);
            setProfileOpen(false);
        }
    };

    useEffect(() => {
        if (prevNotificationOpen.current === true && notificationOpen === false) {
            notificationAnchorRef.current.focus();
        }
        prevNotificationOpen.current = notificationOpen;

        if (prevProfileOpen.current === true && profileOpen === false) {
            profileAnchorRef.current.focus();
        }
        prevProfileOpen.current = profileOpen;
    }, [notificationOpen, profileOpen]);

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };






    return (
        <header className="flex h-screen bg-[#526D82] select-none">
            <nav className="flex flex-col items-center justify-between bg-[#27374D] p-4 border-r border-[#9DB2BF]">
                <div className="grid gap-4">
                    <Link to={`/`} className='flex flex-col items-center gap-1 text-sm font-medium text-[#DDE6ED] hover:text-[#9DB2BF]'>
                        <MessageSquareIcon className="h-6 w-6 text-[#DDE6ED]" />
                    </Link>
                </div>

                <Stack direction="column" spacing={2} sx={{ mt: 'auto' }}>
                    <div>
                        <IconButton
                            ref={notificationAnchorRef}
                            aria-controls={notificationOpen ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleNotificationToggle}
                        >
                            <FiBell className='text-[#DDE6ED]' />
                        </IconButton>
                        <Popper open={notificationOpen} anchorEl={notificationAnchorRef.current} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}
                                >
                                    <Paper className="bg-[#526D82] text-[#DDE6ED] border border-[#9DB2BF]">
                                        <ClickAwayListener onClickAway={handleNotificationClose}>
                                            <MenuList autoFocusItem={notificationOpen} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                {!notification.length && <MenuItem>No New Messages</MenuItem>}
                                                {notification.map((notif) => (
                                                    <MenuItem
                                                        key={notif._id}
                                                        onClick={() => {
                                                            setSelectedChat(notif.chat);
                                                            setNotification(notification.filter((n) => n !== notif));
                                                        }}
                                                    >
                                                        {notif.chat.isGroupChat
                                                            ? `New Message in ${notif.chat.chatName}`
                                                            : `New Message from ${getSender(user, notif.chat.users)}`}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                    <div>
                        <Avatar
                            ref={profileAnchorRef}
                            id="composition-button"
                            aria-controls={profileOpen ? 'composition-menu' : undefined}
                            aria-expanded={profileOpen ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleProfileToggle}
                            alt={user ? user.name : 'Unknown User'}
                            src={user ? user.pic : avatar}
                        />
                        <Popper open={profileOpen} anchorEl={profileAnchorRef.current} role={undefined} placement="bottom-start" transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}
                                >
                                    <Paper className="bg-[#526D82] text-[#DDE6ED] border border-[#9DB2BF]">
                                        <ClickAwayListener onClickAway={handleProfileClose}>
                                            <MenuList autoFocusItem={profileOpen} id="composition-menu" aria-labelledby="composition-button" onKeyDown={handleListKeyDown}>
                                                <ProfileModal user={user}>
                                                    <MenuItem className="hover:bg-[#9DB2BF]">Profile</MenuItem>
                                                </ProfileModal>
                                                <MenuItem className="hover:bg-[#9DB2BF]" onClick={handleProfileClose}>My account</MenuItem>
                                                <MenuItem className="hover:bg-[#9DB2BF]" onClick={logoutHandler}>Logout</MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                </Stack>
            </nav>
        </header>

    );
}

export default ChatHeader;
