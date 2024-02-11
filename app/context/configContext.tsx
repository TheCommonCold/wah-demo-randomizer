import React, { createContext, useContext, useEffect, useState } from "react";
import { consts } from "../consts";
import { DiscordMessage } from "../api/client";
import { env } from "process";

interface ConfigContextData {
  premiumToFreeRatio: string;
  rolesWeight: string;
  setPremiumToFreeRatio: (value: string) => void;
  setRolesWeight: (value: string) => void;
}

const ConfigContext = createContext<ConfigContextData | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [premiumToFreeRatio, setPremiumToFreeRatio] = useState(
    env.PREMIUM_IN_A_ROW ?? "3",
  );

  const [rolesWeight, setRolesWeight] = useState(env.ROLES_WEIGHT ?? "20");

  const contextValue: ConfigContextData = {
    premiumToFreeRatio,
    rolesWeight,
    setPremiumToFreeRatio,
    setRolesWeight,
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};
