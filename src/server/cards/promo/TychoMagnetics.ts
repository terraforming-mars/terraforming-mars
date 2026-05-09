import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {canSpendEnergyForCards, spendEnergyForCards} from './energyForCards';

export class TychoMagnetics extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.TYCHO_MAGNETICS,
      tags: [Tag.POWER, Tag.SCIENCE],
      startingMegaCredits: 42,
      behavior: {
        production: {energy: 1},
      },

      metadata: {
        cardNumber: 'XC02', // Rename
        description: 'You start with 42 M€. Increase your energy production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.production((pb) => pb.energy(1)).nbsp.megacredits(42);
          b.corpBox('action', (cb) => {
            cb.action('Spend any amount of energy to draw the that many cards. Keep 1 and discard the rest.', (ab) => {
              ab.text('X').energy(1).startAction.text('X').cards(1).text('KEEP 1');
            });
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return canSpendEnergyForCards(player);
  }

  public action(player: IPlayer) {
    return spendEnergyForCards(player);
  }
}
