import { useState, useEffect, useRef } from "react";
import {
    Box,
    IconButton,
    Typography,
    CircularProgress,
    Avatar,
    Button,
    Input,
    Tooltip,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import io from "socket.io-client";
import { Player } from "lottie-react";
import animationData from "../animations/typing.json";
import ProfileModal from "./Modals/ProfileModal";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { PhoneIcon, SendIcon, VideoIcon } from "./Icons";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../config/ChatLogics";

const ENDPOINT = "http://localhost:5000"; // -> After deployment Paste your website URL
let socket, selectedChatCompare;

function ChatConversation({ fetchAgain, setFetchAgain }) {

    //State for Managing the messages
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    // ChatState provides context
    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
    const messagesEndRef = useRef(null);

    // It defines the smooth Scrolling of the ui
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Uses async function to fetch chats from the server side of the app
    const fetchMessages = async () => {
        if (!selectedChat || !selectedChat._id) return;

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            alert("Failed to load the messages");
            setLoading(false);
        }
    };

    //It uses async function to send messages to the DATABASE
    const sendMessage = async (event) => {
        event.preventDefault();
        if (newMessage && selectedChat && selectedChat._id) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                alert("Failed to send the message");
            }
        }
    };

    // It uses useEffect to listen to the socket connection
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        return () => {
            socket.off("typing");
            socket.off("stop typing");
            socket.off("connected");
        };
    }, [user]);

    // It uses useEffect to select and fetch Messages for the server
    useEffect(() => {
        if (selectedChat && selectedChat._id) {
            fetchMessages();
            selectedChatCompare = selectedChat;
        }
        // eslint-disable-next-line
    }, [selectedChat]);

    // It uses useEffect to Receive messages for the socet io connection
    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });

        return () => socket.off("message received");
        // eslint-disable-next-line
    }, [messages, notification, fetchAgain, setFetchAgain]);

    // It provides the typing animation when the user is typing on the input message
    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <nav className="flex flex-1 flex-col text-3xl md:text-2xl">
                        <div className="border-b p-2">
                            <div className="flex items-center gap-4">
                                <IconButton onClick={() => setSelectedChat(null)}>
                                    <ArrowBack />
                                </IconButton>
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} >
                                    <div className="flex flex-row items-center">
                                        <Avatar className="border mr-2">
                                            <Avatar src={getSender(user, selectedChat.users.pic)} />
                                        </Avatar>
                                        <div>
                                            <h2 className="text-lg font-medium">{getSender(user, selectedChat.users)}</h2>
                                            <p className="text-xs text-muted-foreground">Active 2 hours ago</p>
                                        </div>
                                    </div>
                                </ProfileModal>
                                <div className="ml-auto flex items-center gap-2">
                                    <Button variant="ghost" size="icon">
                                        <PhoneIcon className="h-5 w-5" />
                                        <span className="sr-only">Call</span>
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <VideoIcon className="h-5 w-5" />
                                        <span className="sr-only">Video Call</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div className="relative flex-1 overflow-y-scroll p-2">
                        <div className="grid gap-4 pb-6"> {/* Added padding to avoid overlap */}
                            {loading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                    <CircularProgress size={40} />
                                </Box>
                            ) : (
                                <div className="h-full overflow-y-scroll p-2">
                                    {messages &&
                                        messages.map((m, i) => (
                                            <div className="flex items-center" key={m._id}>
                                                {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                                                    <Tooltip title={m.sender.name} placement="bottom-start" arrow>
                                                        <Avatar
                                                            sx={{ mt: "7px", mr: 1, cursor: "pointer" }}
                                                            alt={m.sender.name}
                                                            src={m.sender.pic}
                                                        />
                                                    </Tooltip>
                                                )}
                                                <span
                                                    className={`${m.sender._id === user._id ? "bg-blue-100" : "bg-green-100"
                                                        } ml-${isSameSenderMargin(messages, m, i, user._id)} ${isSameUser(messages, m, i, user._id) ? "mt-3" : "mt-10"
                                                        } rounded-2xl px-5 py-1 max-w-3/4 break-words`}
                                                >
                                                    {m.content}
                                                </span>
                                            </div>
                                        ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                            {istyping && (
                                <div className="mb-2 ml-0">
                                    <Player
                                        autoplay
                                        loop
                                        src={animationData}
                                        style={{ height: 70, width: 70 }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-3"> {/* Updated to fixed position */}
                            <form className="flex  items-center space-x-2" onSubmit={sendMessage}>
                                <Input
                                    id="message"
                                    placeholder="Type your message..."
                                    className="flex-1"
                                    autoComplete="off"
                                    value={newMessage}
                                    onChange={typingHandler}
                                />
                                <Button type="submit" size="icon">
                                    <SendIcon className="h-5 w-5" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </form>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex h-full justify-center items-center text-center px-5">
                    <Typography variant="h4">
                        Click on a user to start chatting
                    </Typography>
                </div>
            )}
        </>
    );
}

export default ChatConversation;
