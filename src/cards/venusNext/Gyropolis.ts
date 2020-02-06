
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { Resources } from '../../Resources';
import { SelectSpace } from '../../inputs/SelectSpace';
import { ISpace } from '../../ISpace';

export class Gyropolis implements IProjectCard {
    public cost: number = 20;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = "Gyropolis";
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
        if (game.board.getAvailableSpacesForCity(player).length === 0) return false;
        return player.getProduction(Resources.ENERGY) >= 2;
      }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,-2);
        player.setProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH) + player.getTagCount(Tags.VENUS));
        return new SelectSpace("Select space for city tile", game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            return undefined;
        }); 
    }
}    