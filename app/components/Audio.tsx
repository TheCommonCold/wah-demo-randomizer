import React, { useState, useEffect } from "react";

type UseAudioReturn = [boolean, () => void];

const useAudio = (url: string): UseAudioReturn => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = (): void => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  return [playing, toggle];
};

interface PlayerProps {
  url: string;
}

const Player: React.FC<PlayerProps> = ({ url }) => {
  const [playing, toggle] = useAudio(url);

  return (
    <div>
      <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
    </div>
  );
};

export default Player;
