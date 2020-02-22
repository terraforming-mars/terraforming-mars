
import { PlayerInputTypes } from "./PlayerInputTypes";

export interface PlayerInput {
    inputType: PlayerInputTypes;
    title: string;
    cb: (...item: any) => PlayerInput | undefined;
}
