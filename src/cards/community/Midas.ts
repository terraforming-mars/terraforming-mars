import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Midas implements CorporationCard {
    public name = CardName.MIDAS;
    public tags = [];
    public startingMegaCredits: number = 120;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.decreaseTerraformRatingSteps(7);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R41',
      description: 'You start with 120 MC. Lower your TR 7 steps.',
      renderData: CardRenderer.builder((b) => {
        b.vSpace(CardRenderItemSize.LARGE).br;
        b.megacredits(120, CardRenderItemSize.LARGE).nbsp.nbsp.nbsp;
        b.minus().tr(7);
      }),
    }
}
