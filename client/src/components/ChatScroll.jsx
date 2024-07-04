import React, { useRef, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";

const ChatScroll = ({ messages }) => {
    const { user } = ChatState();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="h-full overflow-y-auto p-4">
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
                                } rounded-2xl px-5 py-1 max-w-3/4`}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatScroll;
