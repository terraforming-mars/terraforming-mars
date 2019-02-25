
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { SpaceType } from "../SpaceType";

export class UndergroundCity implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = "Underground City";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Place a city tile. Decrease your energy production 2 steps and increase your steel production 2 steps";
    public description: string = "Excavating is expensive, but gives both protection and building materials";
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.getSpaces(SpaceType.LAND).filter((space) => space.tile === undefined || (space.player === undefined || space.player === player));
    }
    public play(player: Player, game: Game) {
        if (player.energyProduction < 2) {
            throw "Requires 2 energy production";
        }
        return new SelectSpace(this.name, "Select space for city tile", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
            game.addCityTile(player, foundSpace.id);
            player.energyProduction -= 2;
            player.steelProduction += 2;
            return undefined;
        });
    }
}
