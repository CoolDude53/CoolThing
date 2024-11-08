import React, { useEffect, useState } from "react";
import { DeskThing } from "deskthing-client";
import { SongData } from "deskthing-client/dist/types";
import { MusicStore } from "../stores/musicStore";

const ShuffleState: React.FC = () => {
  const musicStore = MusicStore.getInstance();
  const deskthing = DeskThing.getInstance();

  const [shuffleState, setShuffleState] = useState<boolean>(false);
  const [repeatState, setRepeatState] = useState<"off" | "all" | "track">(
    "off"
  );

  useEffect(() => {
    const handleStateChange = async (musicData: SongData) => {
      setShuffleState(musicData.shuffle_state || false);

      setRepeatState(musicData.repeat_state || "off");
    };

    const listener = musicStore.on(handleStateChange);

    return () => {
      listener();
    };
  }, [musicStore]);

  const toggleShuffleRepeat = () => {
    const currentShuffleState = shuffleState;
    const currentRepeatState = repeatState;

    if (currentRepeatState === "off") {
      if (currentShuffleState) {
        deskthing.sendMessageToParent({
          type: "action",
          app: "client",
          payload: { id: "repeat", source: "server" },
        });
      }

      deskthing.sendMessageToParent({
        type: "action",
        app: "client",
        payload: { id: "shuffle", source: "server" },
      });
    } else if (currentRepeatState === "all") {
      deskthing.sendMessageToParent({
        type: "action",
        app: "client",
        payload: { id: "repeat", source: "server" },
      });
    } else if (currentRepeatState === "track") {
      if (currentShuffleState) {
        deskthing.sendMessageToParent({
          type: "action",
          app: "client",
          payload: { id: "shuffle", source: "server" },
        });
      }

      deskthing.sendMessageToParent({
        type: "action",
        app: "client",
        payload: { id: "repeat", source: "server" },
      });
    }
  };

  return (
    <button
      onClick={toggleShuffleRepeat}
      style={{ background: "var(--background-contrast)" }}
      className="p-4"
    >
      {(() => {
        if (!shuffleState && repeatState === "off") {
          return (
            <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
            >
              <path d="M13.151 0.238708C13.0823 0.165021 12.9995 0.105919 12.9075 0.0649273C12.8155 0.0239353 12.7162 0.00189351 12.6155 0.000116721C12.5148 -0.00166006 12.4148 0.0168646 12.3214 0.0545856C12.228 0.0923066 12.1432 0.148451 12.072 0.21967C12.0007 0.290889 11.9446 0.375723 11.9069 0.469111C11.8692 0.562499 11.8506 0.662528 11.8524 0.763231C11.8542 0.863934 11.8762 0.963247 11.9172 1.05525C11.9582 1.14725 12.0173 1.23005 12.091 1.29871L13.109 2.31671H11.16C10.6123 2.31672 10.0713 2.43669 9.57494 2.66819C9.07859 2.89969 8.63898 3.2371 8.287 3.65671L2.114 11.0127C1.90279 11.2645 1.63899 11.467 1.34115 11.6059C1.0433 11.7448 0.718642 11.8167 0.39 11.8167H0V13.3167H0.391C0.938681 13.3167 1.47971 13.1967 1.97606 12.9652C2.47241 12.7337 2.91202 12.3963 3.264 11.9767L9.437 4.62071C9.64821 4.36892 9.91201 4.16646 10.2099 4.02755C10.5077 3.88865 10.8324 3.81668 11.161 3.81671H13.108L12.091 4.83471C11.9585 4.97688 11.8864 5.16493 11.8898 5.35923C11.8933 5.55353 11.972 5.73892 12.1094 5.87633C12.2468 6.01374 12.4322 6.09245 12.6265 6.09588C12.8208 6.09931 13.0088 6.02719 13.151 5.89471L15.98 3.06671L13.15 0.238708H13.151ZM0.391 2.81671H0V1.31671H0.391C1.5 1.31671 2.551 1.80671 3.264 2.65671L4.89 4.59371L3.911 5.76071L2.115 3.62071C1.90368 3.36879 1.63972 3.16625 1.34169 3.02734C1.04366 2.88844 0.718811 2.81654 0.39 2.81671H0.391Z" />
              <path d="M7.5 10.0641L8.48 8.89712L9.437 10.0371C9.64821 10.2889 9.91201 10.4914 10.2099 10.6303C10.5077 10.7692 10.8324 10.8411 11.161 10.8411H13.108L12.091 9.82312C12.0173 9.75446 11.9582 9.67166 11.9172 9.57966C11.8762 9.48766 11.8542 9.38835 11.8524 9.28764C11.8506 9.18694 11.8692 9.08691 11.9069 8.99352C11.9446 8.90014 12.0007 8.8153 12.072 8.74408C12.1432 8.67287 12.228 8.61672 12.3214 8.579C12.4148 8.54128 12.5148 8.52275 12.6155 8.52453C12.7162 8.52631 12.8155 8.54835 12.9075 8.58934C12.9995 8.63033 13.0823 8.68944 13.151 8.76312L15.98 11.5911L13.151 14.4191C13.0823 14.4928 12.9995 14.5519 12.9075 14.5929C12.8155 14.6339 12.7162 14.6559 12.6155 14.6577C12.5148 14.6595 12.4148 14.641 12.3214 14.6032C12.228 14.5655 12.1432 14.5094 12.072 14.4382C12.0007 14.3669 11.9446 14.2821 11.9069 14.1887C11.8692 14.0953 11.8506 13.9953 11.8524 13.8946C11.8542 13.7939 11.8762 13.6946 11.9172 13.6026C11.9582 13.5106 12.0173 13.4278 12.091 13.3591L13.109 12.3411H11.16C10.6123 12.3411 10.0713 12.2211 9.57494 11.9896C9.07859 11.7581 8.63898 11.4207 8.287 11.0011L7.5 10.0641Z" />
            </svg>
          );
        } else if (shuffleState && repeatState === "off") {
          return (
            <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-brand"
            >
              <path d="M13.151 0.238708C13.0823 0.165021 12.9995 0.105919 12.9075 0.0649273C12.8155 0.0239353 12.7162 0.00189351 12.6155 0.000116721C12.5148 -0.00166006 12.4148 0.0168646 12.3214 0.0545856C12.228 0.0923066 12.1432 0.148451 12.072 0.21967C12.0007 0.290889 11.9446 0.375723 11.9069 0.469111C11.8692 0.562499 11.8506 0.662528 11.8524 0.763231C11.8542 0.863934 11.8762 0.963247 11.9172 1.05525C11.9582 1.14725 12.0173 1.23005 12.091 1.29871L13.109 2.31671H11.16C10.6123 2.31672 10.0713 2.43669 9.57494 2.66819C9.07859 2.89969 8.63898 3.2371 8.287 3.65671L2.114 11.0127C1.90279 11.2645 1.63899 11.467 1.34115 11.6059C1.0433 11.7448 0.718642 11.8167 0.39 11.8167H0V13.3167H0.391C0.938681 13.3167 1.47971 13.1967 1.97606 12.9652C2.47241 12.7337 2.91202 12.3963 3.264 11.9767L9.437 4.62071C9.64821 4.36892 9.91201 4.16646 10.2099 4.02755C10.5077 3.88865 10.8324 3.81668 11.161 3.81671H13.108L12.091 4.83471C11.9585 4.97688 11.8864 5.16493 11.8898 5.35923C11.8933 5.55353 11.972 5.73892 12.1094 5.87633C12.2468 6.01374 12.4322 6.09245 12.6265 6.09588C12.8208 6.09931 13.0088 6.02719 13.151 5.89471L15.98 3.06671L13.15 0.238708H13.151ZM0.391 2.81671H0V1.31671H0.391C1.5 1.31671 2.551 1.80671 3.264 2.65671L4.89 4.59371L3.911 5.76071L2.115 3.62071C1.90368 3.36879 1.63972 3.16625 1.34169 3.02734C1.04366 2.88844 0.718811 2.81654 0.39 2.81671H0.391Z" />
              <path d="M7.5 10.0641L8.48 8.89712L9.437 10.0371C9.64821 10.2889 9.91201 10.4914 10.2099 10.6303C10.5077 10.7692 10.8324 10.8411 11.161 10.8411H13.108L12.091 9.82312C12.0173 9.75446 11.9582 9.67166 11.9172 9.57966C11.8762 9.48766 11.8542 9.38835 11.8524 9.28764C11.8506 9.18694 11.8692 9.08691 11.9069 8.99352C11.9446 8.90014 12.0007 8.8153 12.072 8.74408C12.1432 8.67287 12.228 8.61672 12.3214 8.579C12.4148 8.54128 12.5148 8.52275 12.6155 8.52453C12.7162 8.52631 12.8155 8.54835 12.9075 8.58934C12.9995 8.63033 13.0823 8.68944 13.151 8.76312L15.98 11.5911L13.151 14.4191C13.0823 14.4928 12.9995 14.5519 12.9075 14.5929C12.8155 14.6339 12.7162 14.6559 12.6155 14.6577C12.5148 14.6595 12.4148 14.641 12.3214 14.6032C12.228 14.5655 12.1432 14.5094 12.072 14.4382C12.0007 14.3669 11.9446 14.2821 11.9069 14.1887C11.8692 14.0953 11.8506 13.9953 11.8524 13.8946C11.8542 13.7939 11.8762 13.6946 11.9172 13.6026C11.9582 13.5106 12.0173 13.4278 12.091 13.3591L13.109 12.3411H11.16C10.6123 12.3411 10.0713 12.2211 9.57494 11.9896C9.07859 11.7581 8.63898 11.4207 8.287 11.0011L7.5 10.0641Z" />
            </svg>
          );
        } else if (repeatState === "all") {
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-2.66453e-14 1 16 14.82"
              fill="currentColor"
              className="h-12 w-12 text-brand"
            >
              <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z" />
            </svg>
          );
        } else if (repeatState === "track") {
          return (
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-2.66453e-14 1 16 14.82"
                fill="currentColor"
                className="h-12 w-12 text-brand"
              >
                <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z" />
              </svg>
              <div className="absolute left-1/2 top-3.5 -translate-x-1/2 -translate-y-1 transform font-inter text-sm font-bold text-brand">
                1
              </div>
            </div>
          );
        }
      })()}
    </button>
  );
};

export default ShuffleState;
