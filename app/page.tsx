"use client";

import { useChat } from "ai/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useEffect, useRef } from "react";
import {
  Bot,
  Loader,
  Loader2,
  MoreHorizontal,
  Plus,
  Send,
  User2,
  X,
} from "lucide-react";
import Image from "next/image";
import Markdown from "./component/markdown";
import { ChangeEvent, useState } from "react";
import SelectedImages from "./component/selectedImages";
import Messages from "./component/messages";
import InputForm from "./component/inputForm";
import LogoTitle from "./component/headx";
import logo from "./component/images/logo.png";
import logo2 from "./component/images/logo2.png"; // Import logo image

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "api/genai",
    });

  // Reference to the bottom of the messages list
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex min-h-screen flex-col items-center p-12 text-lg">
      <LogoTitle
        logoSrc={logo2}  // Pass the imported logo directly
        logoAlt="Your Company Logo"
        title=""
        className="mb-4"  // Add some margin bottom for spacing
      />
      
      <InputForm
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
      />
      
      <Messages messages={messages} isLoading={isLoading} />

      {/* Dummy div to scroll to */}
      <div ref={messagesEndRef} />
      <SpeedInsights />
    </main>
  );
}
