
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
    public canPlay(player: Player, _game: Game): boolean {
        return player.getProduction(Resources.ENERGY) >= 2;
    }
    public play(player: Player, game: Game) {
        if (player.getProduction(Resources.ENERGY) < 2) {
            throw "Must have energy production";
        }
        player.setProduction(Resources.ENERGY,-2);
        player.setProduction(Resources.STEEL,2);
        player.setProduction(Resources.TITANIUM);
        return game.increaseOxygenLevel(player, 2);
    }
}
