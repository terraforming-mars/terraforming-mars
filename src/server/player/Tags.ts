// Methods for a player's relationship to their card tags

import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {TagCount} from '../../common/cards/TagCount';
import {ALL_TAGS, Tag} from '../../common/cards/Tag';
import {ICorporationCard, isICorporationCard} from '../cards/corporation/ICorporationCard';
import {ICard} from '../cards/ICard';
import {IProjectCard} from '../cards/IProjectCard';
import {IPlayer} from '../IPlayer';
import {OneOrArray} from '../../common/utils/types';

export type CountingMode =
  'raw' | // Count face-up tags literally, including Leavitt Station.
  'default' | // Like raw, but include the wild tags. Typical when performing an action.
  'milestone' | // Like raw with special conditions for milestones (Chimera)
  'award' | // Like raw with special conditions for awards (Chimera)
  'raw-pf'; // Like raw, but includes Mars Tags when tag is Science (Habitat Marte)

export type DistinctCountMode =
  'default' | // Count all tags in played cards, and then add in all the wild tags.
  'milestone' | // Like default with special conditions for milestones (Chimera)
  'globalEvent'; // Like default, but does not reduce the count size based on max tags in the game. Should be removed.

export type MultipleCountMode =
  'default' | // Count each tag individually, add wild tags, and (Moon) Earth Embassy.
  'milestone' | // Like default, including Chimera.
  'award'; // Like default, including Chimera.

/**
 * Provides common behaviors for analyzing tags on cards.
 *
 * Most everything is meant to match observable behavior. It also takes into account some special
 * card behaviors:
 *
 * 1. Odyssey (PF) leaves events face up, so their tags count.
 * 2. Earth Embassy (Moon) counts Moon tags count as Earth tags.
 * 3. Habitat Marte (PF) Mars tags count as science tags.
 * 4. Chimera (PF) has two wild tags, but only count as one tag for milestones and (funding) awards.
 *
 */
export class Tags {
  private static COUNTED_TAGS = ALL_TAGS.filter((tag) => tag !== Tag.CLONE && tag !== Tag.EVENT);

  private player: IPlayer;
  constructor(player: IPlayer) {
    this.player = player;
  }

  /**
   * Returns a count of tags on face-up cards, plus a count of events.
   *
   * Excludes Clone tags.
   */
  public countAllTags(): Array<TagCount> {
    const counts = Tags.COUNTED_TAGS.map((tag) => {
      return {tag, count: this.count(tag, 'raw')};
    }).filter((tag) => tag.count > 0);
    counts.push({tag: Tag.EVENT, count: this.player.getPlayedEventsCount()});
    return counts;
  }

  /*
   * Get the number of tags this player has.
   */
  public count(tag: Tag, mode: CountingMode = 'default') {
    const includeEvents = this.player.isCorporation(CardName.ODYSSEY);
    const includeTagSubstitutions = (mode === 'default' || mode === 'milestone');

    let tagCount = this.rawCount(tag, includeEvents);

    // Leavitt Station hook
    if (tag === Tag.SCIENCE && this.player.scienceTagCount > 0) {
      tagCount += this.player.scienceTagCount;
    }

    if (includeTagSubstitutions) {
      // Earth Embassy hook
      if (tag === Tag.EARTH && this.player.cardIsInEffect(CardName.EARTH_EMBASSY)) {
        tagCount += this.rawCount(Tag.MOON, includeEvents);
      }

      if (tag !== Tag.WILD) {
        tagCount += this.rawCount(Tag.WILD, includeEvents);
      }
    }

    // Habitat Marte hook
    if (mode !== 'raw') {
      if (tag === Tag.SCIENCE && this.player.isCorporation(CardName.HABITAT_MARTE)) {
        tagCount += this.rawCount(Tag.MARS, includeEvents);
      }
    }

    // Chimera hook
    if (this.player.isCorporation(CardName.CHIMERA)) {
      // Awards do not count wild tags, so in this case one will be added.
      if (mode === 'award') {
        tagCount++;
      }
      // Milestones count wild tags, so in this case one will be deducted.
      if (mode === 'milestone') {
        tagCount--;
      }
    }
    return tagCount;
  }

  /**
   * Returns true if `card` has `tag`. This does not include wild tags, but it includes
   * Habitat Marte and Earth Embassy exceptions.
   */
  public cardHasTag(card: ICard, target: Tag): boolean {
    for (const tag of card.tags) {
      if (tag === target) return true;
      if (tag === Tag.MARS &&
        target === Tag.SCIENCE &&
        this.player.isCorporation(CardName.HABITAT_MARTE)) {
        return true;
      }
      if (tag === Tag.MOON &&
        target === Tag.EARTH &&
        this.player.cardIsInEffect(CardName.EARTH_EMBASSY)) {
        return true;
      }
    }
    return false;
  }

  public cardTagCount(card: ICard, target: OneOrArray<Tag>): number {
    let count = 0;
    for (const tag of card.tags) {
      if (tag === target) {
        count++;
      } else if (Array.isArray(target) && target.includes(tag)) {
        count++;
      } else if (tag === Tag.MARS && target === Tag.SCIENCE &&
        this.player.isCorporation(CardName.HABITAT_MARTE)) {
        count++;
      } else if (tag === Tag.MOON && target === Tag.EARTH &&
        this.player.cardIsInEffect(CardName.EARTH_EMBASSY)) {
        count++;
      }
    }
    return count;
  }

  // Counts the tags in the player's play area only.
  protected rawCount(tag: Tag, includeEventsTags: boolean) {
    let tagCount = 0;

    this.player.tableau.forEach((card: IProjectCard | ICorporationCard) => {
      if (!includeEventsTags && card.type === CardType.EVENT) return;
      if (isICorporationCard(card) && card.isDisabled) return;
      tagCount += card.tags.filter((cardTag) => cardTag === tag).length;
    });

    return tagCount;
  }

  /**
   * Return the total number of tags assocaited with these types.
   * Tag substitutions are included, and not counted repeatedly.
    */
  public multipleCount(tags: Array<Tag>, mode: MultipleCountMode = 'default'): number {
    let tagCount = 0;
    tags.forEach((tag) => {
      tagCount += this.rawCount(tag, false);
    });

    // This is repeated behavior from getTagCount, sigh, OK.
    if (tags.includes(Tag.EARTH) && !tags.includes(Tag.MOON) && this.player.cardIsInEffect(CardName.EARTH_EMBASSY)) {
      tagCount += this.rawCount(Tag.MOON, false);
    }

    if (mode !== 'award') {
      tagCount += this.rawCount(Tag.WILD, false);
      // Chimera has 2 wild tags but should only count as one for milestones.
      if (this.player.isCorporation(CardName.CHIMERA) && mode === 'milestone') tagCount--;
    } else {
      // Chimera counts as one wild tag for awards
      if (this.player.isCorporation(CardName.CHIMERA)) tagCount++;
    }

    return tagCount;
  }

  /**
   * Counts the number of distinct tags the player has.
   *
   * `extraTag` (optional) represents a tag from a card that is in the middle of being played. If the card had multiple tags,
   * this API could change, but right the additional argument is only used once.
   */
  public distinctCount(mode: DistinctCountMode, extraTag?: Tag): number {
    const uniqueTags = new Set<Tag>();
    let wildTagCount = 0;

    const addTag = (tag: Tag) => {
      if (tag === Tag.WILD) {
        wildTagCount++;
      } else {
        uniqueTags.add(tag);
      }
    };

    for (const card of this.player.corporations) {
      if (!card.isDisabled) {
        card.tags.forEach(addTag);
      }
    }
    for (const card of this.player.playedCards) {
      if (card.type !== CardType.EVENT) {
        card.tags.forEach(addTag);
      }
    }
    if (this.player.isCorporation(CardName.ODYSSEY)) {
      for (const card of this.player.playedCards) {
        if (card.type === CardType.EVENT) {
          card.tags.forEach(addTag);
        }
      }
    }

    if (extraTag !== undefined) {
      uniqueTags.add(extraTag);
    }

    // Leavitt Station hook
    if (this.player.scienceTagCount > 0) uniqueTags.add(Tag.SCIENCE);

    // TODO(kberg): I think the global event case is unnecessary.
    if (mode === 'globalEvent') return uniqueTags.size;

    if (mode === 'milestone' && this.player.isCorporation(CardName.CHIMERA)) wildTagCount--;

    // TODO(kberg): it might be more correct to count all the tags
    // in a game regardless of expansion? But if that happens it needs
    // to be done once, during set-up so that this operation doesn't
    // always go through every tag every time.
    let maxTagCount = 10;
    const game = this.player.game;
    if (game.gameOptions.venusNextExtension) maxTagCount++;
    if (game.gameOptions.moonExpansion) maxTagCount++;
    if (game.gameOptions.pathfindersExpansion) maxTagCount++;
    return Math.min(uniqueTags.size + wildTagCount, maxTagCount);
  }

  // Return true if this player has all the tags in `tags` showing.
  public playerHas(tags: Array<Tag>): boolean {
    let distinctCount = 0;
    tags.forEach((tag) => {
      if (this.count(tag, 'raw') > 0) {
        distinctCount++;
      } else if (tag === Tag.SCIENCE && this.player.hasTurmoilScienceTagBonus) {
        distinctCount++;
      }
    });
    if (distinctCount + this.count(Tag.WILD) >= tags.length) {
      return true;
    }
    return false;
  }

  public gainScienceTag(count: number) {
    this.player.scienceTagCount += count;
  }

  /**
   * Return the number of cards in the player's hand without tags.
   *
   * Wild tags are ignored in this computation because in every known case, more cards without
   * tags is better.
   *
   * Does not include Odyssey behavior.
   */
  public numberOfCardsWithNoTags(): number {
    const filtered = this.player.tableau.filter((card) => {
      // Special-case pharmacy union which is out of play once it's disabled.
      if (card.name === CardName.PHARMACY_UNION && card.isDisabled === true) {
        return false;
      }
      return card.type !== CardType.EVENT && card.tags.every((tag) => tag === Tag.WILD);
    });
    return filtered.length;
  }
}
