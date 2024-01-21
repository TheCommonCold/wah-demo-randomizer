import React from "react";
import { DiscordMessage } from "../api/messages/client";
import Message from "./Message";

export interface DiscordMessagesProps {
  messages: DiscordMessage[];
  isPremium: boolean;
}

const Messages = ({ messages, isPremium }: DiscordMessagesProps) => {
  messages.sort((a, b) => (a.seen && !b.seen ? 1 : -1));
  return (
    <div className="p-5">
      {messages.map((message) => (
        <div className=" mb-5" key={message.id}>
          <Message message={message} isPremium={isPremium} />
        </div>
      ))}
    </div>
  );
};

export default Messages;
