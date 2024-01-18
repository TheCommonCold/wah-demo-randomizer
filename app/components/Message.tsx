import Image from "next/image";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import moment from "moment";
import { DiscordMessage } from "../api/messages/client";
import { ArrowUturnDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ConfirmDialog from "./Dialog";
import { useLocalStorage } from "../context/localStorageContext";

const Message: React.FC<{ message: DiscordMessage; isPremium: boolean }> = ({
  message,
  isPremium,
}) => {
  const { markSongAsUnseen } = useLocalStorage();
  const [isOpen, setIsOpen] = useState(false);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = message.content.split(urlRegex);
  const formattedMessageText = parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300"
        >
          <p className=" truncate">{part}</p>
        </a>
      );
    } else {
      return <span key={index}>{part}</span>;
    }
  });

  const attachment = message.attachments[0];
  const audio = attachment?.content_type?.includes("audio") ? (
    <div className="mt-4 pt-2 border-t-2 border-slate-500">
      {attachment.filename}
      <AudioPlayer src={attachment.url} />
    </div>
  ) : null;

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const clearLocalStorage = () => {
    markSongAsUnseen(message.id);
    closeModal();
  };

  return (
    <div
      className={`w-full max-w-md relative mb-4 p-4 bg-gray-800 rounded-lg ${message.seen ? "bg-slate-800" : isPremium ? "border-blue-500 border-2 rounded-xl" : "border-slate-700 border-2 rounded-xl"}`}
    >
      <ConfirmDialog
        isOpen={isOpen}
        closeModal={closeModal}
        action={clearLocalStorage}
        innerText={"Are you sure you want to move this demo back to unseen?"}
      />
      {message.seen && (
        <div className="absolute top-0 right-0 m-2">
          <button onClick={openModal}>
            <ArrowUturnDownIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      )}

      <div className="flex items-center">
        <span>
          {" "}
          {isPremium ? (
            <Image
              src="/assets/wah_logo.jpg"
              alt="wah logo"
              width="20"
              height="20"
              className="mr-2"
            />
          ) : null}
        </span>

        <span
          className={`font-semibold ${message.seen ? "text-slate-600" : isPremium ? "text-blue-400" : "text-white"}`}
        >
          {message.author.global_name ?? message.author.username}
        </span>
        <span
          className={`text-gray-400 ml-2 ${message.seen ? "text-slate-600" : ""}`}
        >
          ({moment(message.timestamp).format("YYYY-MM-DD HH:mm:ss")})
        </span>
      </div>
      <p className={`mt-2 ${message.seen ? "text-slate-600" : "text-white"}`}>
        {formattedMessageText}
      </p>
      {audio}
    </div>
  );
};

export default Message;
