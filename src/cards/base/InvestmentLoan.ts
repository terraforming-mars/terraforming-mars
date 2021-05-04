import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class InvestmentLoan extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.INVESTMENT_LOAN,
      tags: [Tags.EARTH],
      cost: 3,

      metadata: {
        cardNumber: '151',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(-1)).nbsp.megacredits(10);
        }),
        description: 'Decrease your M€ production 1 step. Gain 10 M€.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -4;
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -1);
    player.megaCredits += 10;
    return undefined;
  }
}
