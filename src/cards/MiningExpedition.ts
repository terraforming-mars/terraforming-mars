
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class MiningExpedition implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.MINING_EXPEDITION;

    public play(player: Player, game: Game) {
        game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 2);
        player.steel += 2;
        return game.increaseOxygenLevel(player, 1);
    }
}
