import Image from "next/image";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import moment from "moment";
import { DiscordMessage } from "../api/client";
import { ArrowUturnDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ConfirmDialog from "./Dialog";
import { useLocalStorage } from "../context/localStorageContext";

const Message: React.FC<{
  message: DiscordMessage;
  isPremium: boolean;
  summedProbabilities?: number;
  showFullLink?: boolean;
}> = ({
  message,
  isPremium,
  summedProbabilities = null,
  showFullLink = false,
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
          <p style={{ wordBreak: "break-all" }}>
            {showFullLink ? part : "Link"}
          </p>
        </a>
      );
    } else {
      return <span key={index}>{part}</span>;
    }
  });

  const attachment = message.attachments[0];
  const audio = attachment?.content_type?.includes("audio") ? (
    <div className="mt-4 border-slate-500 pt-5">
      {<b>{attachment.filename}</b>}
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
      className={`relative w-full max-w-[48rem] rounded-lg bg-gray-800 p-4 ${message.seen ? "opacity-50 grayscale" : isPremium ? "rounded-xl border-2 border-primary" : "rounded-xl border-2 border-slate-700"}`}
    >
      <ConfirmDialog
        isOpen={isOpen}
        closeModal={closeModal}
        action={clearLocalStorage}
        innerText={"Are you sure you want to move this demo back to unseen?"}
      />
      {message.seen && (
        <div className="absolute right-0 top-0 m-2">
          <button onClick={openModal}>
            <ArrowUturnDownIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      )}

      <div className="flex items-center">
        <span>
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
          className={`font-semibold ${isPremium ? "text-primary" : "text-white"}`}
        >
          {message.author.global_name ?? message.author.username}
        </span>
        {summedProbabilities && !message.seen ? (
          <span className={`pl-3 text-xs text-white`}>
            {Math.round((message.probability / summedProbabilities) * 1000) /
              10}
            %
          </span>
        ) : null}
        <span className={`ml-2 text-gray-400`}>
          ({moment(message.timestamp).format("YYYY-MM-DD HH:mm:ss")})
        </span>
      </div>
      <p className={`mt-2`} style={{ wordBreak: "break-all" }}>
        {formattedMessageText}
      </p>
      {audio}
    </div>
  );
};

export default Message;
