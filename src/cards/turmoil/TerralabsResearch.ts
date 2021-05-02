import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class TerralabsResearch extends Card implements CorporationCard {
  constructor() {
    super({
      name: CardName.TERRALABS_RESEARCH,
      tags: [Tags.SCIENCE, Tags.EARTH],
      startingMegaCredits: 14,
      cardType: CardType.CORPORATION,
      cardCost: 1,

      metadata: {
        cardNumber: 'R14',
        description: 'You start with 14 M€. Lower your TR 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(14).nbsp.minus().tr(1);
          b.corpBox('effect', (ce) => {
            ce.effect('Buying cards to hand costs 1 M€.', (eb) => {
              eb.cards(1).startEffect.megacredits(1);
            });
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.decreaseTerraformRating();
    return undefined;
  }
}
