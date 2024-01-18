import React from "react";
import FreeQueue from "./FreeQueue";
import PremiumQueue from "./PremiumQueue";
import { PremiumAndFreeMessages } from "../api/messages/route";

const Queues = ({ freeDemos, premiumDemos }: PremiumAndFreeMessages) => {
  return (
    <div className="flex flex-row justify-center space-x-10">
      <FreeQueue messages={freeDemos} />
      <PremiumQueue messages={premiumDemos} />
    </div>
  );
};

export default Queues;
