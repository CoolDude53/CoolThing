import React from "react";
import { DeskThing } from "deskthing-client";

const Skip: React.FC = () => {
  const deskthing = DeskThing.getInstance();

  const skip = () => {
    deskthing.sendMessageToParent({
      type: "action",
      app: "client",
      payload: { id: "skip", source: "server" },
    });
  };

  return (
    <button onClick={skip} className="p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="1 1 14 14"
        fill="currentColor"
        className="h-12 w-12 text-white"
      >
        <path
          d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"
          fill="#FFFF"
        />
      </svg>
    </button>
  );
};

export default Skip;
