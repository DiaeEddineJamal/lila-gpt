import React from "react";
import Markdown from "./markdown";
import { Bot, User2, Copy } from "lucide-react"; // Import the Copy icon
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
        return (
          <div
            key={index}
            className={`p-4 rounded-3xl shadow-2xl relative backdrop-blur-md ${
              m.role === "user"
                ? "bg-gradient-to-r from-[#2F2F2F] to-[#3C3C3C] text-white"
                : "bg-gradient-to-r from-[#3C3C3C] to-[#2F2F2F] text-white"
            } ${
              m.role === "user"
                ? "chat-bubble user relative flex flex-row-reverse"
                : "chat-bubble assistant relative"
            }`}
          >
            <Markdown text={m.content} />
            {m.role === "user" ? (
              <User2 className="absolute -right-8 top-1/2 -translate-y-1/2 border-2 border-[#7B61FF] rounded-full p-2 shadow-2xl" />
            ) : (
              <Bot
                className={`absolute top-1/2 -left-8 -translate-y-1/2 border-2 border-[#7B61FF] rounded-full p-2 shadow-2xl ${
                  isLoading && index === messages.length - 1
                    ? "animate-bounce"
                    : ""
                }`}
              />
            )}
            {m.role !== "user" && (
              <Copy
                className="absolute -right-8 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
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
