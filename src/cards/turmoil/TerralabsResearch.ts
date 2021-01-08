import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class TerralabsResearch implements CorporationCard {
    public name = CardName.TERRALABS_RESEARCH;
    public tags = [Tags.SCIENCE, Tags.EARTH];
    public startingMegaCredits: number = 14;
    public cardType = CardType.CORPORATION;
    public cardCost = 1;

    public play(player: Player) {
      player.decreaseTerraformRating();
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R14',
      description: 'You start with 14 MC. Lower your TR 1 step.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.megacredits(14).nbsp.minus().tr(1);
        b.corpBox('effect', (ce) => {
          ce.effect('Buying cards to hand costs 1MC.', (eb) => {
            eb.cards(1).startEffect.megacredits(1);
          });
        });
      }),
    }
}
