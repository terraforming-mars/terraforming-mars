
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';

export class DomedCrater implements IProjectCard {
    public cost: number = 24;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = 'Domed Crater';
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return player.energyProduction >= 1 &&
        game.getOxygenLevel() <= 7 - player.getRequirementsBonus(game) &&
        game.getAvailableSpacesForCity(player).length >= 0;
    }
    public play(player: Player, game: Game) {
      return new SelectSpace(
          'Select space for city tile',
          game.getAvailableSpacesForCity(player),
          (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.plants += 3;
            player.energyProduction--;
            player.megaCreditProduction += 3;
            return undefined;
          }
      );
    }
    public getVictoryPoints() {
      return 1;
    }
}
