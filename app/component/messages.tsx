import React from "react";
import Markdown from "./markdown";
import { Bot, User2, Copy } from "lucide-react";
import { Message } from "ai/react";

type Props = {
    messages: Message[];
    isLoading: boolean;
};

const Messages = ({ messages, isLoading }: Props) => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(
            () => {
                alert("Text copied to clipboard!");
            },
            (err) => {
                alert("Failed to copy text: ");
            }
        );
    };

    return (
        <div
            id="chatbox"
            className="flex flex-col-reverse w-full text-left mt-4 gap-6 whitespace-pre-wrap"
        >
            {messages.map((m, index) => {
                const isImage = m.content.startsWith("data:image") || m.content.startsWith("http");

                return (
                    <div
                        key={index}
                        className={`p-6 rounded-3xl shadow-lg relative backdrop-blur-md transition-all duration-300 ${
                            m.role === "user"
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white self-end"
                                : "bg-gradient-to-r from-gray-700 to-gray-800 text-white self-start"
                        } ${
                            m.role === "user"
                                ? "chat-bubble user relative flex flex-row-reverse"
                                : "chat-bubble assistant relative"
                        }`}
                        style={{
                            maxWidth: "75%",
                            animation: "fade-in 0.5s ease-in-out",
                        }}
                    >
                        {isImage ? (
                            <img src={m.content} alt="Generated" className="rounded-xl" />
                        ) : (
                            <Markdown text={m.content} />
                        )}
                        {m.role === "user" ? (
                            <User2 className="absolute -right-8 top-1/2 -translate-y-1/2 border-2 border-[#7B61FF] rounded-full p-2 shadow-2xl bg-gray-800" />
                        ) : (
                            <Bot
                                className={`absolute top-1/2 -left-8 -translate-y-1/2 border-2 border-[#7B61FF] rounded-full p-2 shadow-2xl bg-gray-800 ${
                                    isLoading && index === messages.length - 1
                                        ? "animate-bounce"
                                        : ""
                                }`}
                            />
                        )}
                        {m.role !== "user" && !isImage && (
                            <Copy
                                className="absolute -right-8 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200"
                                onClick={() => copyToClipboard(m.content)}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Messages;