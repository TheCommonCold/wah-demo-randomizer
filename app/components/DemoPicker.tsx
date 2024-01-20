import { useEffect, useState } from "react";
import Image from "next/image";
import { PremiumAndFreeMessages } from "../api/messages/route";
import Message from "./Message";
import { useLocalStorage } from "../context/localStorageContext";
import { env } from "process";

const DemoPicker = ({
  unseenDemos,
}: {
  unseenDemos: PremiumAndFreeMessages;
}) => {
  const animationTime = 1750;

  const {
    storedData,
    markSongAsSeen,
    setPremiumInARowCount,
    setPickedMessage,
  } = useLocalStorage();

  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(false);
    }, animationTime);
  }, []);

  const getRandomMessage = (data: PremiumAndFreeMessages) => {
    const isItTimeForAFreeDemo =
      data.freeDemos.length == 0
        ? false
        : data.premiumDemos.length == 0
          ? true
          : storedData.premiumInARowCount >=
            (env.PREMIUM_IN_A_ROW ? Number(env.PREMIUM_IN_A_ROW) : 3);
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
    <div>
      {(unseenDemos.premiumDemos.length != 0 ||
        unseenDemos.freeDemos.length != 0) && (
        <div className="flex flex-col items-center justify-center mb-5">
          <Image
            className="cursor-pointer py-2 px-4 rounded"
            onClick={() => {
              setAnimate(true);
              setTimeout(() => {
                getRandomMessage(unseenDemos);
                setAnimate(false);
              }, animationTime);
            }}
            src={
              animate
                ? "/assets/wah_button.gif"
                : "/assets/wah_button_frame.gif"
            }
            alt="wah logo"
            width={200}
            height={200}
          />
          <div className="pt-5 text-lg">
            Premium demos in a row: {storedData.premiumInARowCount}/
            {env.PREMIUM_IN_A_ROW ?? 3}
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
        </div>
      )}
    </div>
  );
};

export default DemoPicker;
