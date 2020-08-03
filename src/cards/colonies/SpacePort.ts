import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";
import { Game } from '../../Game';
import { SelectSpace } from "../../inputs/SelectSpace";
import { ISpace } from '../../ISpace';

export class SpacePort implements IProjectCard {
    public cost: number = 22;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: CardName = CardName.SPACE_PORT;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        if (game.board.getAvailableSpacesForCity(player).length === 0) return false;
        let coloniesCount: number = 0;
        game.colonies.forEach(colony => { 
          coloniesCount += colony.colonies.filter(owner => owner === player.id).length;
        }); 
        return coloniesCount > 0 && player.getProduction(Resources.ENERGY) > 0;
    }

    public play(player: Player, game: Game) {
      player.setProduction(Resources.MEGACREDITS, 4);  
      player.setProduction(Resources.ENERGY, -1);
      player.fleetSize++;
      return new SelectSpace("Select space for city tile", game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
        game.addCityTile(player, space.id);
        return undefined;
      }); 
    }
}
