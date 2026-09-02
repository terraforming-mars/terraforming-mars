import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {canSpendEnergyForCards, spendEnergyForCards} from './energyForCards';

export class HiTechLab extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.HI_TECH_LAB,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 17,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'X04',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend any amount of energy to draw the same number of cards. TAKE 1 INTO HAND AND DISCARD THE REST.', (eb) => {
            eb.text('X').energy(1).startAction.text('X').cards(1).asterix();
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
