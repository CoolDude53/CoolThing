import React, { useEffect, useState } from "react";
import { MusicStore } from "../stores/musicStore";
import { DeskThing } from "deskthing-client";
import { SongData } from "deskthing-client/dist/types";

const PlayPause: React.FC = () => {
  const musicStore = MusicStore.getInstance();
  const deskthing = DeskThing.getInstance();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handlePlayStateChange = async (musicData: SongData) => {
      setIsPlaying(musicData.is_playing);
    };

    const listener = musicStore.on(handlePlayStateChange);

    return () => {
      listener();
    };
  }, [musicStore]);

  const togglePlayPause = () => {
    musicStore.setPlay(!isPlaying);

    deskthing.sendMessageToParent({
      type: "action",
      app: "client",
      payload: { id: "play", source: "server" },
    });
  };

  return (
    <button onClick={togglePlayPause} className="rounded-full">
      {isPlaying ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 36 36"
          className="h-20 w-20"
        >
          <mask id="pause-mask">
            <rect width="36" height="36" fill="white" />
            <g transform="translate(10,10)">
              <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
            </g>
          </mask>
          <circle cx="18" cy="18" r="18" fill="white" mask="url(#pause-mask)" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 36 36"
          className="h-20 w-20"
        >
          <mask id="play-mask">
            <rect width="36" height="36" fill="white" />
            <g transform="translate(6,6)">
              <path d="M19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z" />
            </g>
          </mask>
          <circle cx="18" cy="18" r="18" fill="white" mask="url(#play-mask)" />
        </svg>
      )}
    </button>
  );
};

export default PlayPause;
