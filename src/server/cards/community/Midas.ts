import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class Midas extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.MIDAS,
      startingMegaCredits: 120,
      cardType: CardType.CORPORATION,

      metadata: {
        cardNumber: 'R41',
        description: 'You start with 120 M€. Lower your TR 7 steps.',
        renderData: CardRenderer.builder((b) => {
          b.vSpace(Size.LARGE).br;
          b.megacredits(120, {size: Size.LARGE}).nbsp.nbsp.nbsp;
          b.minus().tr(7);
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.decreaseTerraformRatingSteps(7);
    return undefined;
  }
}
