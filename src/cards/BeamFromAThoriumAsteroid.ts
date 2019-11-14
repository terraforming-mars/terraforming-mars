import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class BeamFromAThoriumAsteroid implements IProjectCard {
    public cost: number = 32;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE, Tags.ENERGY];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Beam From A Thorium Asteroid";
    public text: string = "Requires a jovian tag. Increase your heat production and energy production 3 steps each. Gain 1 victory point.";
    public requirements: string = "Jovian";
    public description: string = "Nuclear energy is safe, especially when located on a remote asteroid rich in radioactive elements.";
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.JOVIAN) >= 1;
    }
    public play(player: Player, _game: Game) {
        if (player.getTagCount(Tags.JOVIAN) < 1) {
            throw "Requires a jovian tag";
        }
        player.heatProduction += 3;
        player.energyProduction += 3;
        player.victoryPoints++;
        return undefined;
    }
}