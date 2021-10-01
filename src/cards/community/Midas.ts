import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class Midas extends Card implements CorporationCard {
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

  public play(player: Player) {
    player.decreaseTerraformRatingSteps(7);
    return undefined;
  }
}
