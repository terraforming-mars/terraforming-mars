
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class DomedCrater implements IProjectCard {
    public cost: number = 24;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: CardName = CardName.DOMED_CRATER;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return player.getProduction(Resources.ENERGY) >= 1 &&
        game.getOxygenLevel() <= 7 + player.getRequirementsBonus(game) &&
        game.board.getAvailableSpacesForCity(player).length > 0;
    }
    public play(player: Player, game: Game) {
      return new SelectSpace(
          'Select space for city tile',
          game.board.getAvailableSpacesForCity(player),
          (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.plants += 3;
            player.setProduction(Resources.ENERGY,-1);
            player.setProduction(Resources.MEGACREDITS,3);
            return undefined;
          }
      );
    }
    public getVictoryPoints() {
      return 1;
    }
}
