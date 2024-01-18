import React from "react";
import Image from "next/image";
import Messages from "./Messages";
import { DiscordMessage } from "../api/messages/client";
import { useLocalStorage } from "../context/localStorageContext";

const PremiumQueue = ({ messages }: { messages: DiscordMessage[] }) => {
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
      isPremium: true,
    });
    setPremiumInARowCount(storedData.premiumInARowCount + 1);
    markSongAsSeen(newPickedMessage.id);
  };

  return (
    <div className="bg-blue-600 p-4 rounded-lg flex flex-col">
      <button
        className="mb-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={getRandomMessage}
      >
        Random premium demo
      </button>

      <h1 className="text-white text-xl font-bold">
        <div className="flex items-center">
          <Image
            src="/assets/wah_logo.jpg"
            alt="wah logo"
            width="20"
            height="20"
            className="mr-2"
          />
          Premium Queue ({messages.filter((m) => !m.seen).length}/
          {messages.length})
        </div>
      </h1>
      <Messages messages={messages} isPremium={true} />
    </div>
  );
};

export default PremiumQueue;
