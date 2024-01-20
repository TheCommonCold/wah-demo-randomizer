import React from "react";
import { PremiumAndFreeMessages } from "../api/messages/route";
import Queue from "./Queue";

const Queues = ({ freeDemos, premiumDemos }: PremiumAndFreeMessages) => {
  return (
    <div className="flex flex-row justify-center space-x-10">
      <div className="w-1/2">
        <Queue messages={freeDemos} isPremium={false} />
      </div>
      <div className="w-1/2">
        <Queue messages={premiumDemos} isPremium={true} />
      </div>
    </div>
  );
};

export default Queues;
