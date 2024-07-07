import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import Sidebar from "../components/Sidebar";
import ChatConversation from "../components/ChatConversation";

function ChatPage() {
    // useStates for fetching messages form the Sidebar & chatConversation page
    const [fetchAgain, setFetchAgain] = useState(false);
    const { user } = ChatState();

    return (
        <div className="h-screen flex ">
            {user && (
                <>
                    <div className="sm:w-full md:w-1/4 lg:w-1/5 bg-gray-100">
                        <Sidebar fetchAgain={fetchAgain} />
                    </div>
                    <div className="flex-grow bg-white">
                        <ChatConversation fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                    </div>
                </>
            )}
        </div>
    );
}

export default ChatPage;
