
import { PlayerInputTypes } from "../PlayerInputTypes";

export interface PlayerInputModel {
    availableSpaces: Array<string> | undefined;
    canUseHeat: boolean | undefined;
    canUseSteel: boolean | undefined;
    canUseTitanium: boolean | undefined;
    cards: Array<string> | undefined;
    inputType: PlayerInputTypes;
    options: Array<PlayerInputModel> | undefined;
    max: number | undefined;
    maxCardsToSelect: number | undefined;
    minCardsToSelect: number | undefined;
    players: Array<string> | undefined;
    title: string;
}

