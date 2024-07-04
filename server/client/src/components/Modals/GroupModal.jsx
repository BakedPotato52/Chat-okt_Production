import React, { useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import UserBadge from "../userAvatar/UserBadge";
import UserListItem from "../userAvatar/UserListItem";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    CircularProgress,
    FormControl,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GroupModal = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [chatType, setChatType] = useState("single"); // state for chat type
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.warn("User already added", {
                position: "top",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast.error("Failed to Load the Search Results", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (chatType === "group" && (!groupChatName || !selectedUsers.length)) {
            toast.warn("Please fill all the fields for group chat", {
                position: "top",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (chatType === "single" && !selectedUsers.length) {
            toast.warn("Please select a user for single chat", {
                position: "top",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            let data;
            if (chatType === "group") {
                data = await axios.post(
                    `/api/chat/group`,
                    {
                        name: groupChatName,
                        users: selectedUsers.map((u) => u._id), // Ensure user IDs are sent correctly
                    },
                    config
                );
                setChats([data, ...chats]);
                toast.success("New Group Chat Created!", {
                    position: "bottom",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                data = await axios.post(
                    `/api/chat`,
                    {
                        users: selectedUsers.map((u) => u._id), // Ensure user IDs are sent correctly
                        chatName: selectedUsers.map((u) => u.name),

                    },
                    config
                );
                setChats([data, ...chats]);
                toast.success("New Single Chat Created!", {
                    position: "bottom",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            handleClose();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <span onClick={handleOpen}>{children}</span>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 300, sm: 400, md: 500 },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography id="modal-title" variant="h6" component="h2" textAlign="center" mb={2}>
                        Create Chat
                    </Typography>
                    <FormControl fullWidth margin="normal">
                        <ToggleButtonGroup
                            color="primary"
                            value={chatType}
                            exclusive
                            onChange={(e, newType) => setChatType(newType)}
                            aria-label="chat type"
                            fullWidth
                        >
                            <ToggleButton value="single">Single Chat</ToggleButton>
                            <ToggleButton value="group">Group Chat</ToggleButton>
                        </ToggleButtonGroup>
                    </FormControl>
                    {chatType === "group" && (
                        <FormControl fullWidth margin="normal">
                            <TextField
                                placeholder="Chat Name"
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                variant="outlined"
                                fullWidth
                            />
                        </FormControl>
                    )}
                    <FormControl fullWidth margin="normal">
                        <TextField
                            placeholder={`Add Users${chatType === "group" ? " (eg: John, Piyush, Jane)" : ""}`}
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            variant="outlined"
                            fullWidth
                        />
                    </FormControl>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                        {selectedUsers.map((u) => (
                            <UserBadge key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                        ))}
                    </Box>
                    {loading ? (
                        <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />
                    ) : (
                        searchResult.slice(0, 4).map((user) => (
                            <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                        ))
                    )}
                    <Button onClick={handleSubmit} color="primary" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Create Chat
                    </Button>
                </Box>
            </Modal>
            <ToastContainer />
        </>
    );
};

export default GroupModal;
