
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
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (player.energyProduction < 2) {
                reject("Must have energy to remove");
                return;
            }
            player.energyProduction -= 2;
            player.steelProduction += 2;
            player.titaniumProduction++;
            game.oxygenLevel += 2;
            resolve();
        });
    }
}
