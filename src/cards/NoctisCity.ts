
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
    public play(player: Player, game: Game): Promise<void> {
        const noctisSpace = game.getSpace(SpaceName.NOCTIS_CITY);
        if (player.energyProduction < 1) {
            return Promise.reject("Must have energy production");
        }
        // make sure no tile or land grab on space
        if (noctisSpace.tile === undefined && noctisSpace.player === undefined) {
            try { game.addCityTile(player, noctisSpace.id); }
            catch (err) { return Promise.reject(err); }
            player.energyProduction--;
            player.megaCreditProduction += 3;
            return Promise.resolve();   
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select any city location, noctis taken", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
                try { game.addCityTile(player, space.id); }
                catch (err) { reject(err); return; }
                player.energyProduction--;
                player.megaCreditProduction += 3;
                resolve();
            }));
        });
    }
}
