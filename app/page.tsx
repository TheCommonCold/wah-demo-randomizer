"use client";

import { useState } from "react";
import { PremiumAndFreeMessages } from "./api/messages/route";
import Queues from "./components/Queues";
import useAxios from "./hooks/useAxios";
import { DiscordMessage } from "./api/messages/client";
import Message from "./components/Message";
import ClearAllDialog from "./components/ClearAllDialog";
import {
  LocalStorageProvider,
  useLocalStorage,
} from "./context/localStorageContext";

function Home() {
  const {
    storedData,
    markSongAsSeen,
    setPremiumInARowCount,
    setPickedMessage,
  } = useLocalStorage();

  const discordMessages = useAxios<PremiumAndFreeMessages>({
    url: "/api/messages",
  });

  if (!discordMessages.data) {
    return <div>Loading...</div>;
  }

  const parsedDemos = {
    premiumDemos: discordMessages.data.premiumDemos.map((demo) => ({
      ...demo,
      seen: storedData.seenDemos[demo.id] ?? false,
    })),
    freeDemos: discordMessages.data.freeDemos.map((demo) => ({
      ...demo,
      seen: storedData.seenDemos[demo.id] ?? false,
    })),
  };

  const unseenDemos = {
    premiumDemos: parsedDemos.premiumDemos.filter((demo) => !demo.seen),
    freeDemos: parsedDemos.freeDemos.filter((demo) => !demo.seen),
  };

  const getRandomMessage = (data: PremiumAndFreeMessages) => {
    const isItTimeForAFreeDemo =
      data.freeDemos.length == 0
        ? false
        : data.premiumDemos.length == 0
          ? true
          : storedData.premiumInARowCount > 2;
    const randomIndex = Math.floor(
      Math.random() *
        (isItTimeForAFreeDemo
          ? data.freeDemos.length
          : data.premiumDemos.length),
    );
    const newPickedMessage = isItTimeForAFreeDemo
      ? data.freeDemos[randomIndex]
      : data.premiumDemos[randomIndex];

    setPickedMessage({
      ...newPickedMessage,
      isPremium: !isItTimeForAFreeDemo,
    });
    setPremiumInARowCount(
      isItTimeForAFreeDemo ? 0 : storedData.premiumInARowCount + 1,
    );
    markSongAsSeen(newPickedMessage.id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-5 py-5">
      <div className="flex flex-col items-center justify-center mb-5">
        {(unseenDemos.premiumDemos.length != 0 ||
          unseenDemos.freeDemos.length != 0) && (
          <div className="flex flex-col items-center justify-center mb-5 p-5 bg-slate-900 rounded-lg">
            <div className="pb-5 text-lg">
              Premium demos in a row: {storedData.premiumInARowCount}
              /3
            </div>
            {storedData.pickedMessage && (
              <div className="p-5">
                <Message
                  message={storedData.pickedMessage}
                  isPremium={storedData.pickedMessage.isPremium}
                  showFullLink={true}
                />
              </div>
            )}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => getRandomMessage(unseenDemos)}
            >
              Get random demo
            </button>
          </div>
        )}
      </div>
      <Queues {...parsedDemos} />
      <ClearAllDialog />
    </div>
  );
}

export default function Wrapper() {
  return (
    <LocalStorageProvider>
      <Home />
    </LocalStorageProvider>
  );
}
