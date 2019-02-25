
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceName } from "../SpaceName";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class NoctisCity implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = "Noctis City";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your energy production 1 step and increase your mega credit production 3 steps. Place a city tile on the reserved area, disregarding normal placement restrictions.";
    public description: string = "In Noctis Labyrinthus, where the mist is gray.";
    public play(player: Player, game: Game) {
        const noctisSpace = game.getSpace(SpaceName.NOCTIS_CITY);
        if (player.energyProduction < 1) {
            throw "Must have energy production";
        }
        player.energyProduction--;
        player.megaCreditProduction += 3;
        // make sure no tile or land grab on space
        if (noctisSpace.tile === undefined && (noctisSpace.player === undefined || noctisSpace.player === player)) {
            game.addCityTile(player, noctisSpace.id);
            return undefined;
        }
        return new SelectSpace(this.name, "Select any city location, noctis taken", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            return undefined;
        });
    }
}
