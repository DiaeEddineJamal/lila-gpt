"use client";

import { useChat } from "ai/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Messages from "./component/messages";
import InputForm from "./component/inputForm";
import LogoTitle from "./component/headx";
import logo from "./component/images/logo.png";

export default function Home() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, stop, append } =
        useChat({
            api: "api/genai",
        });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const generateImage = async (prompt: string) => {
        try {
            const response = await fetch("/api/genai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: prompt }],
                    isImageGeneration: true, // Add this flag for image generation
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.text(); // Log the error response
                console.error("API Error Response:", errorResponse);
                throw new Error("Failed to generate image");
            }

            const { imageUrl } = await response.json();
            append({ role: "assistant", content: imageUrl });
        } catch (error) {
            console.error("Error generating image:", error);
            append({ role: "assistant", content: "Failed to generate image. Please try again." });
        }
    };

    return (
        <main className="flex flex-col items-center min-h-screen p-4 text-lg">
            <LogoTitle
                logoSrc={logo}
                logoAlt="Your Company Logo"
                title=""
                className="mb-4"
            />

            <div className="flex-1 w-full overflow-y-auto pb-24 messages-container">
                <Messages messages={messages} isLoading={isLoading} />
                <div ref={messagesEndRef} />
            </div>

            <InputForm
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                stop={stop}
                generateImage={generateImage}
            />

            <SpeedInsights />
        </main>
    );
}