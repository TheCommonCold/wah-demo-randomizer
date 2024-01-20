import React from "react";
import Image from "next/image";
import Messages from "./Messages";
import { DiscordMessage } from "../api/messages/client";
import { useLocalStorage } from "../context/localStorageContext";

interface QueueProps {
  messages: DiscordMessage[];
  isPremium: boolean;
}

const Queue = ({ messages, isPremium }: QueueProps) => {
  const {
    storedData,
    markSongAsSeen,
    setPremiumInARowCount,
    setPickedMessage,
  } = useLocalStorage();

  const getRandomMessage = () => {
    const filteredMessages = messages.filter((m) => !m.seen);
    if (filteredMessages.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredMessages.length);

    const newPickedMessage = filteredMessages[randomIndex];

    setPickedMessage({
      ...newPickedMessage,
      isPremium: isPremium,
    });

    if (isPremium) {
      setPremiumInARowCount(storedData.premiumInARowCount + 1);
    } else {
      setPremiumInARowCount(0);
    }

    markSongAsSeen(newPickedMessage.id);
  };

  return (
    <div
      className={`${isPremium ? "bg-secondary" : "bg-slate-700"} p-4 rounded-lg w-100 flex flex-col`}
    >
      <button
        className={`mb-5 ${isPremium ? "bg-primary hover:bg-blue-600" : "bg-slate-600 hover:bg-slate-500"} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        onClick={getRandomMessage}
      >
        Random {isPremium ? "premium" : "free"} demo
      </button>

      <h1 className="text-white text-xl font-bold">
        <div className="flex items-center">
          {isPremium && (
            <Image
              src="/assets/wah_logo.jpg"
              alt="wah logo"
              width="20"
              height="20"
              className="mr-2"
            />
          )}
          {isPremium ? "Premium" : "Free"} Queue (
          {messages.filter((m) => !m.seen).length}/{messages.length})
        </div>
      </h1>
      <Messages messages={messages} isPremium={isPremium} />
    </div>
  );
};

export default Queue;
