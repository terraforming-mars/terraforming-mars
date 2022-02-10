import {Card} from '../Card';
import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ResourceType} from '../../common/ResourceType';
import {IProjectCard} from '../IProjectCard';
import {PLANETARY_TAGS} from '../../pathfinders/PathfindersExpansion';
import {played} from '../Options';
import {Size} from '../render/Size';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class AdhaiHighOrbitConstructions extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS,
      tags: [Tags.SPACE],
      startingMegaCredits: 43,
      resourceType: ResourceType.ORBITAL,

      metadata: {
        cardNumber: 'PfC23',
        description: 'You start with 43 M€',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(43).nbsp.nbsp.space({played, secondaryTag: AltSecondaryTag.NO_PLANETARY_TAG}).colon().orbital().br;
          b.text('(Effect: When ever you play a card with a space tag BUT NO PLANETARY TAG (including this) add 1 orbital on this card.)', Size.SMALL, false, false);
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
      if (PLANETARY_TAGS.includes(tag)) return false;
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

  public getCardDiscount(player: Player, card: IProjectCard) {
    if (player.isCorporation(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS) && this.matchingTags(card.tags)) {
      return Math.floor(this.resourceCount / 2);
    } else {
      return 0;
    }
  }
}
