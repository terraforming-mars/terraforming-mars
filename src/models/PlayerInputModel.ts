
import { PlayerInputTypes } from "../PlayerInputTypes";
import { ICard } from '../cards/ICard';

export interface PlayerInputModel {
    amount: number | undefined;
    availableSpaces: Array<string> | undefined;
    canUseHeat: boolean | undefined;
    canUseSteel: boolean | undefined;
    canUseTitanium: boolean | undefined;
    cards: Array<ICard> | undefined;
    inputType: PlayerInputTypes;
    options: Array<PlayerInputModel> | undefined;
    max: number | undefined;
    maxCardsToSelect: number | undefined;
    microbes: number | undefined;
    floaters: number | undefined;
    minCardsToSelect: number | undefined;
    players: Array<string> | undefined;
    title: string;
}

