import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class InvestmentLoan extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.INVESTMENT_LOAN,
      tags: [Tag.EARTH],
      cost: 3,
      productionBox: {megacredits: -1},

      metadata: {
        cardNumber: '151',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(-1)).nbsp.megacredits(10);
        }),
        description: 'Decrease your M€ production 1 step. Gain 10 M€.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.megaCredits += 10;
    return undefined;
  }
}
