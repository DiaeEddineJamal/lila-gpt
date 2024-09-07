import { Loader2, Send } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { ChatRequestOptions } from "ai";

type Props = {
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
  input: string;
  isLoading: boolean;
  stop: () => void;
};

const InputForm = ({
  handleInputChange,
  handleSubmit,
  input,
  isLoading,
  stop,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Add a class to the body when submitting to prevent scrollbar flashes
    if (isSubmitting) {
      document.body.classList.add('submitting');
    } else {
      document.body.classList.remove('submitting');
    }

    return () => {
      document.body.classList.remove('submitting');
    };
  }, [isSubmitting]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoading && input.trim()) {
      setIsSubmitting(true);
      try {
        await handleSubmit(event);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      className="sticky bottom-0 left-0 w-full pt-4 pb-6"
      style={{
        backgroundColor: "var(--background-color)", // Match the page's background
        backdropFilter: "blur(10px)", // Optional blur effect
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <form onSubmit={onSubmit} className="relative">
          <div
            className={`
              absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl opacity-50 blur transition-all duration-300
              ${isFocused ? 'opacity-75 scale-105' : 'scale-100'}
            `}
          ></div>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              disabled={isLoading}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="
                w-full py-4 px-6 pr-12 bg-gray-800 text-white placeholder-gray-400
                rounded-xl outline-none transition-all duration-300
                focus:ring-2 focus:ring-purple-500 disabled:bg-gray-700
              "
              style={{
                backgroundColor: "var(--background-color)", // Match input background to the page
                color: "var(--user-text-color)",
                borderRadius: "var(--message-border-radius)",
              }}
            />
            <button
              type="submit"
              className="
                absolute right-2 bg-gradient-to-r from-purple-500 to-indigo-500
                text-white font-medium p-2 rounded-lg transition-all duration-300
                hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              style={{
                backgroundColor: "var(--accent-color)",
              }}
              disabled={isLoading || isSubmitting || !input.trim()}
            >
              {isLoading || isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
