import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from '../../CardName';

export class GreatAquifer extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: CardName = CardName.GREAT_AQUIFER;

    public play(player: Player, game: Game) {
        game.addOceanInterrupt(player, "Select space for first ocean");
        game.addOceanInterrupt(player, "Select space for second ocean");
        return undefined;
    }
}

