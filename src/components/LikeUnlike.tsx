import React, { useEffect, useState } from "react";
import { DeskThing } from "deskthing-client";
import { MusicStore } from "../stores/musicStore.ts";
import LikeIconLiked from "./icons/like-icon-liked.tsx";
import LikeIconLike from "./icons/like-icon-like.tsx";

const LikeUnlike: React.FC = () => {
  const musicStore = MusicStore.getInstance();
  const deskthing = DeskThing.getInstance();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const handleStateChange = async (musicData) => {
      setIsLiked(musicData.isLiked || false);
    };

    const listener = musicStore.on(handleStateChange);

    return () => {
      listener();
    };
  }, [musicStore]);

  const toggleLiked = () => {
    deskthing.sendMessageToParent({
      type: "action",
      app: "client",
      payload: { id: "like_song", source: "spotify" },
    });
  };

  return (
    <button onClick={toggleLiked} className="rounded-full p-4">
      {isLiked ? (
        <LikeIconLiked className="h-14 w-14" />
      ) : (
        <LikeIconLike className="h-14 w-14" />
      )}
    </button>
  );
};

export default LikeUnlike;
