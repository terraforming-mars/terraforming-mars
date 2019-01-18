
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class AsteroidMining implements IProjectCard {
    public cost: number = 30;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Asteroid Mining";
    public text: string = "Increase your titanium production 2 steps. Gain 2 victory points.";
    public description: string = "Where gravity is low and rare minerals abound.";
    public play(player: Player, game: Game): Promise<void> {
        player.titaniumProduction += 2;
        player.victoryPoints += 2;
        return Promise.resolve();
    }
}
