
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
    public text: string = "Decrease your energy production 2 steps. Increase your steel production 2 steps and your titanium production 1 step. Raise oxygen 2 steps.";
    public description: string = "It is not exactly environmentally friendly to just dig up the suface, but it can be profitable.";
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
