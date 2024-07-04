import { useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    TextField,
    Button,
    IconButton,
    CircularProgress,
    Box,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import useDisclosure from "../hooks/useDiscloser"; // Custom hook to replace Chakra's useDisclosure
import { ChatState } from "../../context/ChatProvider";
import UserBadge from "../userAvatar/UserBadge";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const { selectedChat, setSelectedChat, user } = ChatState();

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
            alert("Failed to load search results");
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            alert("Failed to rename the group");
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            alert("User already in group!");
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            alert("Only admins can add someone!");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            alert("Failed to add user");
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            alert("Only admins can remove someone!");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            alert("Failed to remove user");
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <>
            <IconButton onClick={onOpen}>
                <Visibility />
            </IconButton>

            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle>{selectedChat.chatName}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Box display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map((u) => (
                                <UserBadge
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <TextField
                            fullWidth
                            placeholder="Chat Name"
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                            margin="dense"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRename}
                            disabled={renameLoading}
                        >
                            {renameLoading ? <CircularProgress size={24} /> : "Update"}
                        </Button>
                        <TextField
                            fullWidth
                            placeholder="Add User to group"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            margin="dense"
                        />
                    </DialogContentText>
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        searchResult.map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleRemove(user)} color="secondary">
                        Leave Group
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UpdateGroupChatModal;
