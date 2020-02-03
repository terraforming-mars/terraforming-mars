
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceName } from "../SpaceName";
import { Resources } from '../Resources';
import { SelectSpace } from '../inputs/SelectSpace';
import { ISpace } from '../ISpace';

export class NoctisCity implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = "Noctis City";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player, game: Game) {
        const noctisSpace = game.getSpace(SpaceName.NOCTIS_CITY);
        if (player.getProduction(Resources.ENERGY) < 1) {
            throw "Must have energy production";
        }
        player.setProduction(Resources.ENERGY,-1);
        player.setProduction(Resources.MEGACREDITS,3);
        if (game.boardName === "original") {
          game.addCityTile(player, noctisSpace.id);
          return undefined;
        } else {
            return new SelectSpace("Select space for Noctis city", game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
                game.addCityTile(player, space.id);
                return undefined;
            }); 
        }  
    }
}
