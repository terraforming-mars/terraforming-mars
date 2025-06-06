import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IProjectCard} from '../IProjectCard';
import {isPlanetaryTag} from '../../pathfinders/PathfindersData';
import {Size} from '../../../common/cards/render/Size';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {IStandardProjectCard} from '../IStandardProjectCard';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class AdhaiHighOrbitConstructions extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS,
      tags: [Tag.SPACE],
      startingMegaCredits: 43,
      resourceType: CardResource.ORBITAL,

      behavior: {
        // This is the onCardPlayed effect.
        addResources: 1,
      },

      metadata: {
        cardNumber: 'PfC23',
        description: 'You start with 43 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(43).nbsp.nbsp.tag(Tag.SPACE, {secondaryTag: AltSecondaryTag.NO_PLANETARY_TAG}).colon().resource(CardResource.ORBITAL).br;
          b.text('(Effect: Whenever you play a card with a space tag BUT NO PLANETARY TAG (including this) add 1 orbital on this card.)', Size.SMALL, false, false);
          b.br;
          b.effect('For every 2 orbitals on this card, cards with a space tag but with no planetary tag or the STANDARD COLONY PROJECT or TRADE ACTION costs 1M€ less.', (eb) => {
            eb.tag(Tag.SPACE, {secondaryTag: AltSecondaryTag.NO_PLANETARY_TAG}).slash(Size.SMALL).asterix().colonies(1, {size: Size.SMALL}).slash(Size.SMALL).trade({size: Size.SMALL})
              .startEffect
              .minus().megacredits(1).text('/2').resource(CardResource.ORBITAL);
          });
        }),
      },
    });
  }


  private matchingTags(tags: Array<Tag>): boolean {
    let spaceTag = false;
    for (const tag of tags) {
      if (tag === Tag.SPACE) spaceTag = true;
      if (isPlanetaryTag(tag)) return false;
    }
    return spaceTag;
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (player.isCorporation(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS) && this.matchingTags(card.tags)) {
      player.addResourceTo(this, 1);
    }
  }

  // TODO(kberg): it's not possible to make this a cardDiscount type, which just means rendering is tricky.
  public override getCardDiscount(player: IPlayer, card: IProjectCard) {
    // Is this actually called from another player? Why is .isCorporation necessary?
    if (player.isCorporation(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS) && this.matchingTags(card.tags)) {
      return Math.floor(this.resourceCount / 2);
    } else {
      return 0;
    }
  }

  public getStandardProjectDiscount(_player: IPlayer, card: IStandardProjectCard): number {
    if (card.name === CardName.BUILD_COLONY_STANDARD_PROJECT) {
      return Math.floor(this.resourceCount / 2);
    }
    return 0;
  }
}
