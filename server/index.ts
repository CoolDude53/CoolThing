import { DeskThing as DK } from "deskthing-server";

const DeskThing = DK.getInstance();
export { DeskThing };

const start = async () => {};

const stop = async () => {};

DeskThing.on("start", start);
DeskThing.on("stop", stop);
