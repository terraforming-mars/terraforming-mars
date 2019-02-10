
import { PlayerInputTypes } from "./PlayerInputTypes";

export interface PlayerInput {
    inputType: PlayerInputTypes
    message: string
    title: string
    cb: Function
}
