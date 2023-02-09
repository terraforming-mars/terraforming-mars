import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {ICard} from '../ICard';

export class TheArchaicFoundationInstitute extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.THE_ARCHAIC_FOUNDATION_INSTITUTE,
      tags: [Tag.MOON, Tag.MOON],
      startingMegaCredits: 55,
      resourceType: CardResource.RESOURCE_CUBE,

      behavior: {
        addResources: 2,
      },

      metadata: {
        description: 'You start with 55 M€.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(55).br;
          b.effect('When you play a Moon tag, including these, add a resource cube on this card.', (eb) => {
            eb.moon().startEffect.resourceCube();
          }).br;
          b.effect('Automatically remove every 3 resource cubes collected here and increase your TR 1 step.', (eb) => {
            eb.resourceCube(3).startEffect.tr(1);
          });
        }),
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    if (player.isCorporation(this.name)) {
      const moonTags = card.tags.filter((t) => t === Tag.MOON);
      const count = moonTags.length;
      if (count > 0) {
        player.addResourceTo(this, count);
      }
    }
  }

  public onResourceAdded(player: Player, playedCard: ICard): void {
    if (playedCard.name !== this.name) return;
    // TODO(kberg): If for some reason you gain MC but do not play another card, this becomes almost
    // like lost TR.
    if (this.resourceCount >= 3 && player.canAfford(0, {tr: {tr: 1}})) {
      player.removeResourceFrom(this, 3);
      player.increaseTerraformRating();
    }
  }
}
