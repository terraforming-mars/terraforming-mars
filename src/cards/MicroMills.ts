
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";
import { Resources } from "../Resources";
import { CardName } from '../CardName';

export class MicroMills implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.MICRO_MILLS;

    public play(player: Player, _game: Game) {
        player.addProduction(Resources.HEAT);
        return undefined;
    }
}

