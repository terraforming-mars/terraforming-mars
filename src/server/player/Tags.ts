// Methods for a player's relationship to their card tags

import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {ALL_TAGS, Tag} from '../../common/cards/Tag';
import {isICorporationCard} from '../cards/corporation/ICorporationCard';
import {ICard} from '../cards/ICard';
import {IPlayer} from '../IPlayer';
import {OneOrArray} from '../../common/utils/types';
import {intersection} from '../../common/utils/utils';

export type CountingMode =
  'raw' | // Count face-up tags literally, including Leavitt Station.
  'default' | // Like raw, but include the wild tags and other deafult substitutions. Typical when performing an action.
  'milestone' | // Like raw with special conditions for milestones (Chimera)
  'award' | // Like raw with special conditions for awards (Chimera)
  'raw-pf'; // Like raw, but includes Mars Tags when tag is Science (Habitat Marte)

export type DistinctCountMode =
  'default' | // Count all tags in played cards, and then add in all the wild tags.
  'milestone' | // Like default with special conditions for milestones (Chimera)
  'globalEvent'; // Like default, but does not apply wild tags, which are used in the action phase.

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
  private player: IPlayer;
  constructor(player: IPlayer) {
    this.player = player;
  }

  /**
   * Returns a count of tags on face-up cards, plus a count of events.
   */
  public countAllTags(): Record<Tag, number> {
    const counts: Record<Tag, number> = {} as Record<Tag, number>;
    for (const tag of ALL_TAGS) {
      if (tag === Tag.EVENT) {
        continue;
      }
      counts[tag] = this.count(tag, 'raw');
    }
    counts[Tag.EVENT] = this.player.getPlayedEventsCount();
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
   * Returns true if `card` has `tag`. This includes Habitat Marte, but not wild tags and
   * not Earth Embassy.
   */
  public cardHasTag(card: ICard, target: Tag): boolean {
    for (const tag of card.tags) {
      if (tag === target) return true;
      if (tag === Tag.MARS &&
        target === Tag.SCIENCE &&
        this.player.isCorporation(CardName.HABITAT_MARTE)) {
        return true;
      }
    }
    if (target === Tag.EVENT && card.type === CardType.EVENT) {
      return true;
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
      }
    }
    return count;
  }

  // Counts the tags in the player's play area only.
  protected rawCount(tag: Tag, includeEventsTags: boolean) {
    let tagCount = 0;

    for (const card of this.player.tableau) {
      if (!includeEventsTags && card.type === CardType.EVENT) continue;
      if (isICorporationCard(card) && card.isDisabled) continue;
      tagCount += card.tags.filter((cardTag) => cardTag === tag).length;
    }

    return tagCount;
  }

  /**
   * Return the total number of tags associated with these types.
   * Tag substitutions are included, and not counted repeatedly.
   */
  public multipleCount(tags: Array<Tag>, mode: MultipleCountMode = 'default'): number {
    const includeEvents = this.player.isCorporation(CardName.ODYSSEY);

    let tagCount = 0;
    tags.forEach((tag) => {
      tagCount += this.rawCount(tag, includeEvents);
    });

    // This is repeated behavior from getTagCount, sigh, OK.
    if (tags.includes(Tag.EARTH) && !tags.includes(Tag.MOON) && this.player.cardIsInEffect(CardName.EARTH_EMBASSY)) {
      tagCount += this.rawCount(Tag.MOON, includeEvents);
    }

    if (mode !== 'award') {
      tagCount += this.rawCount(Tag.WILD, includeEvents);
      // Chimera has 2 wild tags but should only count as one for milestones.
      if (this.player.isCorporation(CardName.CHIMERA) && mode === 'milestone') tagCount--;
    } else {
      // Chimera counts as one wild tag for awards
      if (this.player.isCorporation(CardName.CHIMERA)) tagCount++;
    }

    return tagCount;
  }

  private _tagsInGame = 0;
  /**
   * Return the number of tags in this game, excluding events, wild, and clone tags.
   *
   * This is also the maximum value that distinctTagCount can return.
   */
  // Public for testing
  public tagsInGame(): number {
    const tags = this.player.game.tags;
    if (this._tagsInGame === 0) {
      const i = intersection(tags, [Tag.EVENT, Tag.CLONE, Tag.WILD]);
      this._tagsInGame = tags.length - i.length;
    }
    return this._tagsInGame;
  }

  /**
   * Counts the number of distinct tags the player has.
   *
   * `extraTag` (optional) represents a tag from a card that is in the middle of being played. If the card had multiple tags,
   * this API could change, but right the additional argument is only used once.
   */
  public distinctCount(mode: DistinctCountMode, extraTag?: Tag): number {
    const uniqueTags = new Set<Tag>();
    const playerIsOdyssey = this.player.isCorporation(CardName.ODYSSEY);
    let wildTagCount = 0;

    for (const card of this.player.tableau) {
      if (card.name === CardName.PHARMACY_UNION && card.isDisabled) {
        continue;
      }
      if (playerIsOdyssey || card.type !== CardType.EVENT) {
        for (const tag of card.tags) {
          if (tag === Tag.WILD) {
            wildTagCount++;
          } else {
            uniqueTags.add(tag);
          }
        }
      }
      if (playerIsOdyssey && card.type === CardType.EVENT) {
        uniqueTags.add(Tag.EVENT);
      }
    }

    // This isn't an issue right now, but if extraTag is Tag.WILD, this won't work correctly.
    if (extraTag !== undefined) {
      uniqueTags.add(extraTag);
    }

    // Leavitt Station hook
    if (this.player.scienceTagCount > 0) uniqueTags.add(Tag.SCIENCE);

    // Global events occur outside the action phase. Stop counting here, before wild tags apply.
    if (mode === 'globalEvent') return uniqueTags.size;

    if (mode === 'milestone' && this.player.isCorporation(CardName.CHIMERA)) wildTagCount--;

    let maximum = this.tagsInGame();
    if (playerIsOdyssey) maximum++;
    return Math.min(uniqueTags.size + wildTagCount, maximum);
  }

  // Return true if this player has all the tags in `tags` showing.
  public playerHas(tags: Array<Tag>): boolean {
    let distinctCount = 0;
    tags.forEach((tag) => {
      if (this.count(tag, 'raw') > 0) {
        distinctCount++;
      } else if (tag === Tag.SCIENCE) {
        if (this.player.hasTurmoilScienceTagBonus) {
          distinctCount++;
        } else if (this.player.isCorporation(CardName.HABITAT_MARTE)) {
          if (this.count(Tag.MARS, 'raw') > 0) {
            distinctCount++;
          }
        }
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
