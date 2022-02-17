import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {ResourceType} from '../../common/ResourceType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {ICard} from '../ICard';

export class TheArchaicFoundationInstitute extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.THE_ARCHAIC_FOUNDATION_INSTITUTE,
      tags: [Tags.MOON, Tags.MOON],
      startingMegaCredits: 55,
      resourceType: ResourceType.RESOURCE_CUBE,

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

  public override resourceCount = 0;

  public play() {
    this.resourceCount += 2;
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    if (player.corporationCard?.name !== this.name) {
      return undefined;
    }
    const moonTags = card.tags.filter((t) => t === Tags.MOON);
    const count = moonTags.length;
    if (count > 0) {
      player.addResourceTo(this, count);
    }
    return undefined;
  }

  public onResourceAdded(player: Player, playedCard: ICard): void {
    if (playedCard.name !== this.name) return;
    // TODO(kberg): If for some reason you gain MC but do not play another card, this becomes almost
    // like lost TR.
    if (this.resourceCount >= 3 && player.canAfford(0, {tr: {tr: 1}})) {
      player.removeResourceFrom(this, 3, player.game, player, true);
      player.increaseTerraformRating();
    }
  }
}
