
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class StripMine implements IProjectCard {
    public cost: number = 25;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Strip Mine";
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 2;
    }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,-2);
        player.setProduction(Resources.STEEL,2);
        player.setProduction(Resources.TITANIUM);
        return game.increaseOxygenLevel(player, 2);
    }
}
