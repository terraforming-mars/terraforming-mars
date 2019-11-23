
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';

export class ElectroCatapult implements IActionCard, IProjectCard {
    public cost: number = 17;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = 'Electro Catapult';
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = 'Spend 1 plant or 1 steel to gain 7 mega ' +
      'credit.';
    public text: string = 'Oxygen must be 8% or less. Decrease your energy ' +
      'production 1 step. Gain 1 victory point.';
    public requirements: string = '8% or less Oxygen';
    public description: string = 'A 200km long acceleration ramp up the ' +
      'side of Pavonis Mons, hurtling export goods into space.';
    public canPlay(player: Player, game: Game): boolean {
      return player.energyProduction >= 1 &&
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
      player.energyProduction--;
      player.victoryPoints++;
      return undefined;
    }
}
