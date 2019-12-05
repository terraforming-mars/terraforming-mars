
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class StripMine implements IProjectCard {
    public cost: number = 25;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Strip Mine";
    public canPlay(player: Player, _game: Game): boolean {
        return player.energyProduction >= 2;
    }
    public play(player: Player, game: Game) {
        if (player.energyProduction < 2) {
            throw "Must have energy production";
        }
        player.energyProduction -= 2;
        player.steelProduction += 2;
        player.titaniumProduction++;
        return game.increaseOxygenLevel(player, 2);
    }
}
