import React from "react";
import { DiscordMessage } from "../api/messages/client";
import Messages from "./Messages";
import { useLocalStorage } from "../context/localStorageContext";

const FreeQueue = ({ messages }: { messages: DiscordMessage[] }) => {
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
      isPremium: false,
    });
    setPremiumInARowCount(0);
    markSongAsSeen(newPickedMessage.id);
  };

  return (
    <div className="bg-slate-600 p-4 rounded-lg flex flex-col">
      <button
        className="mb-5 bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={getRandomMessage}
      >
        Random free demo
      </button>
      <h1 className="text-white text-xl font-bold">
        Free Queue ({messages.filter((m) => !m.seen).length}/{messages.length}){" "}
      </h1>
      <Messages messages={messages} isPremium={false} />
    </div>
  );
};

export default FreeQueue;
