import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class Midas extends CorporationCard {
  constructor() {
    super({
      name: CardName.MIDAS,
      startingMegaCredits: 120,

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

  public override bespokePlay(player: IPlayer) {
    player.decreaseTerraformRating(7);
    return undefined;
  }
}
