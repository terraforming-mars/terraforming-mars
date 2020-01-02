
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import { Resources } from '../Resources';

export class ElectroCatapult implements IActionCard, IProjectCard {
    public cost: number = 17;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = 'Electro Catapult';
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(player: Player, game: Game): boolean {
      return player.getProduction(Resources.ENERGY) >= 1 &&
        game.getOxygenLevel() <= 8 + player.getRequirementsBonus(game);
    }
    public canAct(player: Player): boolean {
      return player.plants > 0 || player.steel > 0;
    }
    public action(player: Player) {
      if (player.plants > 0 && player.steel > 0) {
        return new OrOptions(
            new SelectOption('Spend 1 plant to gain 7 mega credit', () => {
              player.plants--;
              player.megaCredits += 7;
              return undefined;
            }),
            new SelectOption('Spend 1 steel to gain 7 mega credit', () => {
              player.steel--;
              player.megaCredits += 7;
              return undefined;
            })
        );
      } else if (player.plants > 0) {
        player.plants--;
        player.megaCredits += 7;
      } else if (player.steel > 0) {
        player.steel--;
        player.megaCredits += 7;
      }
      return undefined;
    }
    public play(player: Player) {
      player.setProduction(Resources.ENERGY,-1);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
