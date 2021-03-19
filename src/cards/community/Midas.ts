import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Midas extends Card implements CorporationCard {
  constructor() {
    super({
      name: CardName.MIDAS,
      startingMegaCredits: 120,
      cardType: CardType.CORPORATION,

      metadata: {
        cardNumber: 'R41',
        description: 'You start with 120 MC. Lower your TR 7 steps.',
        renderData: CardRenderer.builder((b) => {
          b.vSpace(CardRenderItemSize.LARGE).br;
          b.megacredits(120, CardRenderItemSize.LARGE).nbsp.nbsp.nbsp;
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
