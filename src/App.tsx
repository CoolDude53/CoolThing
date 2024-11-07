import React, { useCallback, useEffect, useRef, useState } from "react";
import { DeskThing } from "deskthing-client";
import { SongData } from "deskthing-client/dist/types";
import { MusicStore } from "./stores/musicStore";
import { CrossFade } from "react-crossfade-simple";
import ShuffleState from "./components/ShuffleState";
import LikeUnlike from "./components/LikeUnlike";
import PlayPause from "./components/PlayPause";
import Rewind from "./components/Rewind";
import Skip from "./components/Skip";
import { sampleSongData } from "./helpers/sampleSong";
import { useSmoothTimer } from "./hooks/useSmoothTimer";
import Vibrant from "node-vibrant/lib/bundle";

export interface SongInfo {
  duration: number;
  currentTime: number;
}

const DEFAULT_BACKGROUND_COLOR = "#3b6374";

const App: React.FC = () => {
  const musicStore = MusicStore.getInstance();
  let [songData, setSongData] = useState<SongData | null>(musicStore.getSong());

  const [songInfo, setSongInfo] = useState<SongInfo>({
    duration: 0,
    currentTime: 0,
  });

  const [fontSize, setFontSize] = useState("text-4xl line-clamp-2");
  const trackNameRef = useRef<HTMLHeadingElement>(null);
  const [backgroundColor, setBackgroundColor] = useState("#3b6374");

  const deskthing = DeskThing.getInstance();

  const trackProgress = useSmoothTimer({
    duration: songInfo.duration / 1000,
    currentTime: songInfo.currentTime / 1000,
    throttleBy: 250,
    isActivelyPlaying: songData?.is_playing,
  });

  const extractAndSetBackgroundColor = (thumbnail: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = thumbnail;

    img.onload = () => {
      Vibrant.from(img)
        .getPalette()
        .then((palette) => {
          const dominantColor =
            palette.LightVibrant?.hex || DEFAULT_BACKGROUND_COLOR;
          setBackgroundColor(dominantColor);
        })
        .catch((err) => {
          console.error("Vibrant error:", err);
          setBackgroundColor(DEFAULT_BACKGROUND_COLOR);
        });
    };
  };

  const adjustFontSize = useCallback(() => {
    if (trackNameRef.current) {
      requestAnimationFrame(() => {
        const element = trackNameRef.current;
        const lineHeight = parseInt(
          window.getComputedStyle(element).lineHeight
        );
        const lines = Math.round(element.scrollHeight / lineHeight);

        if (lines === 1) {
          setFontSize("text-5xl");
        } else {
          setFontSize("text-4xl line-clamp-2");
        }
      });
    }
  }, []);

  useEffect(() => {
    adjustFontSize();
  }, [adjustFontSize]);

  useEffect(() => {
    adjustFontSize();
  }, [songData?.track_name]);

  useEffect(() => {
    const onMusicUpdates = async (data: SongData) => {
      setSongData(data);

      if (data.track_progress && data.track_duration) {
        trackProgress.setLocalTime(data.track_progress / 1000);
        setSongInfo({
          duration: data.track_duration,
          currentTime: data.track_progress,
        });
      }
      if (data.thumbnail && data.thumbnail) {
        extractAndSetBackgroundColor(data.thumbnail);
      }
    };

    const off = musicStore.on(onMusicUpdates);

    return () => {
      off();
    };
  });

  // for local testing
  if (location.href === "http://localhost:5173/") {
    songData = sampleSongData;
    extractAndSetBackgroundColor(songData.thumbnail);
  }

  useEffect(() => {
    const onAppData = async (data: SocketData) => {
      console.log("Received data from the server!");
      console.log(data);
    };
    const removeListener = deskthing.on("pickle.plaza", onAppData);

    return () => {
      removeListener();
    };
  });

  const contentKey = songData ? songData.track_name + songData.artist : "none";

  const progressBarStyle = {
    width: `${(trackProgress.currentTime / (songInfo.duration / 1000)) * 100}%`,
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 h-max w-max">
        <div
          className="absolute inset-0 h-max w-max"
          style={{ backgroundColor }}
        >
          <CrossFade contentKey={contentKey} timeout={1000}>
            <div className="h-screen w-screen" />
          </CrossFade>
        </div>

        <CrossFade contentKey={contentKey} timeout={1000}>
          <div
            className="h-screen w-screen contrast-[55%] saturate-150"
            style={{ backgroundColor }}
          ></div>
        </CrossFade>
      </div>

      {/* Main Content */}
      <CrossFade contentKey={contentKey} timeout={500}>
        <div className="relative flex h-full w-screen flex-col justify-between">
          <div className="flex h-full items-center">
            <div className="mx-4 flex h-full w-screen flex-row items-center px-4 py-10">
              <div
                className="relative flex-shrink-0 overflow-hidden rounded drop-shadow-2xl"
                style={{ width: "25%", paddingBottom: "25%" }}
              >
                <CrossFade
                  contentKey={songData?.thumbnail || "default"}
                  timeout={500}
                >
                  {songData?.thumbnail ? (
                    <img
                      src={songData?.thumbnail}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#00384c]"></div>
                  )}
                </CrossFade>
              </div>
              <div className="mr-16 flex w-full px-2 transition-[width] duration-500">
                <div className="mx-4 flex w-full flex-col gap-2 font-inter">
                  <CrossFade
                    contentKey={songData?.album || "default-album"}
                    timeout={500}
                  >
                    {songData?.album ? (
                      <h3 className="line-clamp-1 tracking-wider text-white/80">
                        {songData?.album}
                      </h3>
                    ) : (
                      <h3 className="line-clamp-1 w-fit animate-pulse rounded bg-slate-200 tracking-wider text-transparent">
                        Loading album name
                      </h3>
                    )}
                  </CrossFade>
                  <CrossFade
                    contentKey={songData?.track_name || "default-track_name"}
                    timeout={500}
                  >
                    {songData?.track_name ? (
                      <h1
                        ref={trackNameRef}
                        className={`font-bold tracking-wide text-white transition-all duration-300 ease-out ${fontSize}`}
                      >
                        {songData?.track_name}
                      </h1>
                    ) : (
                      <h1 className="mt-2 line-clamp-2 w-fit animate-pulse rounded bg-slate-200 text-4xl font-bold tracking-wide text-transparent">
                        Loading track_name
                      </h1>
                    )}
                  </CrossFade>
                  <CrossFade
                    contentKey={songData?.artist || "default-artist"}
                    timeout={500}
                  >
                    {songData?.artist ? (
                      <h2 className="pt-1.5 text-xl tracking-wider text-white/90">
                        {songData?.artist}
                      </h2>
                    ) : (
                      <h2 className="mt-2 w-fit animate-pulse rounded bg-slate-200 pt-1.5 text-xl tracking-wider text-transparent">
                        Loading artist
                      </h2>
                    )}
                  </CrossFade>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex w-screen flex-col items-start justify-center gap-2 bg-black/[35%] pb-14">
            <div className="h-1 w-full">
              <div className="h-1 w-1/2 bg-white" style={progressBarStyle} />
            </div>

            <div className="flex w-full justify-evenly pt-6 text-white">
              <ShuffleState />
              <Rewind />
              <PlayPause />
              <Skip />
              <LikeUnlike />
            </div>
          </div>
        </div>
      </CrossFade>
    </div>
  );
};

export default App;
