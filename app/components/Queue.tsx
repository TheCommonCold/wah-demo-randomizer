import React from "react";
import Image from "next/image";
import Messages from "./Messages";
import { DiscordMessage } from "../api/client";
import { useLocalStorage } from "../context/localStorageContext";
import { randomWithProbabilities } from "../consts";

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

    const randomIndex = randomWithProbabilities(
      filteredMessages.map((demo) => demo.probability),
    );
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

  const summedProbabilities = messages.reduce((acc, message) => {
    if (message.seen) return acc;
    acc += message.probability;
    return acc;
  }, 0);

  return (
    <div
      className={`${isPremium ? "bg-secondary" : "bg-slate-700"} w-100 flex flex-col rounded-lg p-4`}
    >
      <button
        className={`mb-5 ${isPremium ? "bg-primary hover:bg-blue-600" : "bg-slate-600 hover:bg-slate-500"} focus:shadow-outline rounded px-4 py-2 font-bold text-white focus:outline-none`}
        onClick={getRandomMessage}
      >
        Random {isPremium ? "premium" : "free"} demo
      </button>

      <h1 className="text-xl font-bold text-white">
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
      <Messages
        messages={messages}
        isPremium={isPremium}
        summedProbabilities={summedProbabilities}
      />
    </div>
  );
};

export default Queue;
