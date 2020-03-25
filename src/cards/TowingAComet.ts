
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';

export class TowingAComet implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.TOWING_A_COMET;

    public play(player: Player, game: Game) {
        game.addOceanInterrupt(player);
        player.plants += 2;
        return game.increaseOxygenLevel(player, 1);
    }
}
