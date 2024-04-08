import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class TerralabsResearch extends CorporationCard {
  constructor() {
    super({
      name: CardName.TERRALABS_RESEARCH,
      tags: [Tag.SCIENCE, Tag.EARTH],
      startingMegaCredits: 14,
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

  public override bespokePlay(player: IPlayer) {
    player.decreaseTerraformRating();
    return undefined;
  }
}
