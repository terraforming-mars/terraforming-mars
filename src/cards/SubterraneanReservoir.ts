
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';

export class SubterraneanReservoir implements IProjectCard {
    public cost: number = 11;
    public cardType: CardType = CardType.EVENT;
    public tags: Array<Tags> = [];
    public name: string = CardName.SUBTERRANEAN_RESERVOIR;

    public play(player: Player, game: Game) {
        game.addOceanInterrupt(player);
        return undefined;
    }
}

