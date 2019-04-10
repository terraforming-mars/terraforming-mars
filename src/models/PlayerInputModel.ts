
import { PlayerInputTypes } from "../PlayerInputTypes";

export interface PlayerInputModel {
    inputType: PlayerInputTypes;
    message: string;
    title: string;
    options: Array<PlayerInputModel> | undefined;
    cards: Array<string> | undefined;
    minCardsToSelect: number | undefined;
    maxCardsToSelect: number | undefined;
    canUseSteel: boolean | undefined;
    canUseTitanium: boolean | undefined;
    canUseHeat: boolean | undefined;
    players: Array<string> | undefined;
    availableSpaces: Array<string> | undefined;
}

