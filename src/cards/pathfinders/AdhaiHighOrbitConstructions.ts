import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../common/CardResource';
import {IProjectCard} from '../IProjectCard';
import {isPlanetaryTag} from '../../pathfinders/PathfindersExpansion';
import {played} from '../Options';
import {Size} from '../../common/cards/render/Size';
import {AltSecondaryTag} from '../../common/cards/render/AltSecondaryTag';

export class AdhaiHighOrbitConstructions extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS,
      tags: [Tags.SPACE],
      startingMegaCredits: 43,
      resourceType: CardResource.ORBITAL,

      metadata: {
        cardNumber: 'PfC23',
        description: 'You start with 43 M€',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(43).nbsp.nbsp.space({played, secondaryTag: AltSecondaryTag.NO_PLANETARY_TAG}).colon().orbital().br;
          b.text('(Effect: Whenever you play a card with a space tag BUT NO PLANETARY TAG (including this) add 1 orbital on this card.)', Size.SMALL, false, false);
          b.br;
          b.effect('For every 2 orbitals on this card, cards with a space tag but with no planetary tag or the standard colony project or trade action costs 1M€ less.', (eb) => {
            eb.space({played, secondaryTag: AltSecondaryTag.NO_PLANETARY_TAG}).slash(Size.SMALL).colonies(1, {size: Size.SMALL}).slash(Size.SMALL).trade({size: Size.SMALL})
              .startEffect
              .minus().megacredits(1).text('/2').orbital();
          });
        }),
      },
    });
  }

  public override resourceCount = 0;

  private matchingTags(tags: Array<Tags>): boolean {
    let spaceTag: boolean = false;
    for (const tag of tags) {
      if (tag === Tags.SPACE) spaceTag = true;
      if (isPlanetaryTag(tag)) return false;
    }
    return spaceTag;
  }

  public play(player: Player) {
    player.addResourceTo(this, 1);
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (player.isCorporation(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS) && this.matchingTags(card.tags)) {
      player.addResourceTo(this, 1);
    }
  }

  // TODO(kberg): it's not possible to make this a cardDiscount type, which just means rendering is tricky.
  public override getCardDiscount(player: Player, card: IProjectCard) {
    if (player.isCorporation(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS) && this.matchingTags(card.tags)) {
      return Math.floor(this.resourceCount / 2);
    } else {
      return 0;
    }
  }
}
