
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { SpaceName } from "../../SpaceName";
import { SelectSpace } from "../../inputs/SelectSpace";
import { SpaceType } from "../../SpaceType";
import { ISpace } from "../../ISpace";

export class LavaTubeSettlement implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.STEEL, Tags.CITY];
    public name: string = "Lava Tube Settlement";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your energy production 1 step and increase your MC production 2 steps. Place a City Tile on a VOLCANIC AREA regardless of adjacent cities.";
    public requirements: undefined;
    public description: string = "Giant lava tubes can provide protection for early settlement on Mars";

    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.getSpaces(SpaceType.LAND)
                .filter((space) => space.tile === undefined && (space.player === undefined || space.player === player))
                .filter((space) => space.id === SpaceName.THARSIS_THOLUS || space.id === SpaceName.ASCRAEUS_MONS || space.id === SpaceName.ARSIA_MONS);
    }
    public canPlay(player: Player, game: Game): boolean {
        return this.getAvailableSpaces(player, game).length > 0 && player.energyProduction >= 1;
    }

    public play(player: Player, game: Game) {
        return new SelectSpace("Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons", this.getAvailableSpaces(player, game), (space: ISpace) => {
			game.addCityTile(player, space.id);
       		player.megaCreditProduction +=2;
			player.energyProduction--;    
        	return undefined;
		});
    }
}
