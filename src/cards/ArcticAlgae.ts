import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ISpace } from "../ISpace";
import { TileType } from "../TileType";


export class ArcticAlgae implements IProjectCard {
    public cost: number = 12;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Arctic Algae";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "It must be -12C or colder to play. Gain 1 plant. When anyone places an ocean tile, gain 2 plants.";
    public requirements: string = "-12C or Colder";
    public description: string = "Suitable for freezing temperatures.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() <= -12 + (player.getRequirementsBonus(game) * 2);
    }
    public onTilePlaced(player: Player, space: ISpace) {
        if (space.tile !== undefined && space.tile.tileType === TileType.OCEAN) {
            player.plants += 2;
        }
    }
    public play(player: Player) {
        player.plants++;
        return undefined;
    }
}