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
        <Message message={message} isPremium={isPremium} key={message.id} />
      ))}
    </div>
  );
};

export default Messages;
