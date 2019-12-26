
import {IProjectCard} from './IProjectCard';
import {Game} from '../Game';
import {Player} from '../Player';
import {CardType} from './CardType';
import {Tags} from './Tags';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';

export class CorporateStronghold implements IProjectCard {
    public cost: number = 11;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = 'Corporate Stronghold';
    public canPlay(player: Player, game: Game): boolean {
      return player.energyProduction >= 1 && game.getAvailableSpacesForCity(player).length >= 0;
    }
    public play(player: Player, game: Game) {
      return new SelectSpace(
          'Select space for city tile',
          game.getAvailableSpacesForCity(player),
          (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.energyProduction--;
            player.megaCreditProduction += 3;
            return undefined;
          }
      );
    }
    public getVictoryPoints() {
      return -2;
    }
}
