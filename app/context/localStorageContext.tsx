import React, { createContext, useContext, useEffect, useState } from "react";
import { consts } from "../consts";
import { DiscordMessage } from "../api/client";

export type SeenDemos = {
  seenDemos: Record<string, boolean>;
  premiumInARowCount: number;
  pickedMessage: DiscordMessageWithPriority | null;
};

type DiscordMessageWithPriority = DiscordMessage & { isPremium: boolean };

interface LocalStorageContextData {
  storedData: SeenDemos;
  setPremiumInARowCount: (value: number) => void;
  markSongAsSeen: (key: string) => void;
  markSongAsUnseen: (key: string) => void;
  setPickedMessage: (pickedMessage: DiscordMessageWithPriority) => void;
  clearAllData: () => void;
}

const LocalStorageContext = createContext<LocalStorageContextData | undefined>(
  undefined,
);

const getDataFromLocalStorage = () => {
  const initData = {
    seenDemos: {},
    premiumInARowCount: 0,
    pickedMessage: null,
  };
  if (typeof window !== "undefined") {
    const itemsFromLocalStorage = window.localStorage.getItem(
      consts.localStorageKey,
    );
    return itemsFromLocalStorage
      ? (JSON.parse(itemsFromLocalStorage) as SeenDemos)
      : initData;
  }
  return initData;
};

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error(
      "useLocalStorage must be used within a LocalStorageProvider",
    );
  }
  return context;
};

export const LocalStorageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [storedData, setStoredData] = useState<SeenDemos>(
    getDataFromLocalStorage,
  );

  useEffect(() => {
    localStorage.setItem(consts.localStorageKey, JSON.stringify(storedData));
  }, [storedData]);

  const setSeenData = ({ key, value }: { key: string; value: boolean }) => {
    const data = storedData.seenDemos;
    data[key] = value;
    setStoredData((prevData) => ({ ...prevData, seenDemos: data }));
  };

  const setPremiumInARowCount = (value: number) => {
    setStoredData((prevData) => ({ ...prevData, premiumInARowCount: value }));
  };

  const markSongAsSeen = (key: string) => {
    setSeenData({ key, value: true });
  };

  const markSongAsUnseen = (key: string) => {
    setSeenData({ key, value: false });
  };

  const setPickedMessage = (pickedMessage: DiscordMessageWithPriority) => {
    setStoredData((prevData) => ({ ...prevData, pickedMessage }));
  };

  const clearAllData = () => {
    setStoredData({
      seenDemos: {},
      premiumInARowCount: 0,
      pickedMessage: null,
    });
  };

  const contextValue: LocalStorageContextData = {
    storedData,
    setPremiumInARowCount,
    markSongAsSeen,
    markSongAsUnseen,
    setPickedMessage,
    clearAllData,
  };

  return (
    <LocalStorageContext.Provider value={contextValue}>
      {children}
    </LocalStorageContext.Provider>
  );
};
