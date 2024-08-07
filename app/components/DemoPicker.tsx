import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { PremiumAndFreeMessages } from "../api/messages/route";
import Message from "./Message";
import { useLocalStorage } from "../context/localStorageContext";
import { randomWithProbabilities } from "../consts";
import { useConfig } from "../context/configContext";
import { isItTimeForAFreeDemoYet } from "../helpers";

const DemoPicker = ({
  unseenDemos,
}: {
  unseenDemos: PremiumAndFreeMessages;
}) => {
  const animationTime = 1720;

  const {
    storedData,
    markSongAsSeen,
    setPremiumInARowCount,
    setPickedMessage,
  } = useLocalStorage();

  const { premiumToFreeRatio } = useConfig();

  const [message, setMessage] = useState(storedData.pickedMessage);
  const [animate, setAnimate] = useState(false);

  const currMessage = useRef("");

  useEffect(() => {
    setMessage(storedData.pickedMessage);
  }, [storedData.pickedMessage]);

  const getRandomMessage = (data: PremiumAndFreeMessages) => {
    const isItTimeForAFreeDemo = isItTimeForAFreeDemoYet({
      freeDemosLength: data.freeDemos.length,
      premiumDemosLength: data.premiumDemos.length,
      premiumInARowCount: storedData.premiumInARowCount,
      premiumToFreeRatio: Number(premiumToFreeRatio),
    });

    const randomIndex = randomWithProbabilities(
      isItTimeForAFreeDemo
        ? data.freeDemos.map((demo) => demo.probability)
        : data.premiumDemos.map((demo) => demo.probability),
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

  currMessage.current = message?.content ?? "";

  const changeRandomCharImMessage = () => {
    const string = currMessage.current;
    const glitchChars = "`¡™£¢∞§¶•ªº–≠åß∂ƒ©˙∆˚¬…æ≈ç√∫˜µ≤≥÷/?░▒▓<>/".split("");
    const randomCharInex = Math.floor(Math.random() * glitchChars.length);
    const randomChar = glitchChars[randomCharInex];
    const randomIndex = Math.floor(Math.random() * string.length);
    const newString =
      string.substring(0, randomIndex) +
      randomChar +
      string.substring(randomIndex + 1);

    message
      ? setMessage({
          ...message,
          content: newString,
        })
      : null;
  };

  const noMessages =
    unseenDemos.premiumDemos.length === 0 && unseenDemos.freeDemos.length === 0;

  return (
    <div className="h-[40rem]">
      <div
        className={`flex h-1/3 flex-col items-center justify-center ${noMessages ? "brightness-75 grayscale filter" : ""}`}
      >
        <Image
          className="cursor-pointer rounded"
          onClick={(e) => {
            if (noMessages) {
              return;
            }

            setTimeout(() => {
              clearInterval(interval);
              getRandomMessage(unseenDemos);
              setAnimate(false);
            }, animationTime);
            e.preventDefault();
            const audio = new Audio("/assets/wah_button.mp3");
            audio.play();
            setAnimate(true);
            const interval = setInterval(changeRandomCharImMessage, 10);
          }}
          src={
            animate ? "/assets/wah_button.gif" : "/assets/wah_button_frame.gif"
          }
          alt="wah logo"
          width={160}
          height={160}
        />
      </div>
      <div
        className={`flex h-2/3 items-center justify-center p-5 ${animate ? "blur" : ""}`}
      >
        {message && storedData.pickedMessage ? (
          <div className={`${animate ? "" : "shine"}`}>
            <Message
              message={message}
              isPremium={storedData.pickedMessage.isPremium}
              showFullLink={true}
            />
          </div>
        ) : (
          <div className="text-center text-4xl font-bold text-white">
            Submit your demos on WE ARE HUMANS Discord!
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPicker;
