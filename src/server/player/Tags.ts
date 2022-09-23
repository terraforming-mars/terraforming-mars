// Methods for a player's relationship to their card tags

import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {ITagCount} from '../../common/cards/ITagCount';
import {Tag} from '../../common/cards/Tag';
import {ICorporationCard, isICorporationCard} from '../cards/corporation/ICorporationCard';
import {ICard} from '../cards/ICard';
import {IProjectCard} from '../cards/IProjectCard';
import {Player} from '../Player';

export class Tags {
  private player: Player;
  constructor(player: Player) {
    this.player = player;
  }

  public getAllTags(): Array<ITagCount> {
    return [
      {tag: Tag.BUILDING, count: this.count(Tag.BUILDING, 'raw')},
      {tag: Tag.CITY, count: this.count(Tag.CITY, 'raw')},
      {tag: Tag.EARTH, count: this.count(Tag.EARTH, 'raw')},
      {tag: Tag.ENERGY, count: this.count(Tag.ENERGY, 'raw')},
      {tag: Tag.JOVIAN, count: this.count(Tag.JOVIAN, 'raw')},
      {tag: Tag.MARS, count: this.count(Tag.MARS, 'raw')},
      {tag: Tag.MICROBE, count: this.count(Tag.MICROBE, 'raw')},
      {tag: Tag.MOON, count: this.count(Tag.MOON, 'raw')},
      {tag: Tag.PLANT, count: this.count(Tag.PLANT, 'raw')},
      {tag: Tag.SCIENCE, count: this.count(Tag.SCIENCE, 'raw')},
      {tag: Tag.SPACE, count: this.count(Tag.SPACE, 'raw')},
      {tag: Tag.VENUS, count: this.count(Tag.VENUS, 'raw')},
      {tag: Tag.WILD, count: this.count(Tag.WILD, 'raw')},
      {tag: Tag.ANIMAL, count: this.count(Tag.ANIMAL, 'raw')},
      {tag: Tag.EVENT, count: this.player.getPlayedEventsCount()},
    ].filter((tag) => tag.count > 0);
  }

  /*
   * Get the number of tags a player has, depending on certain conditions.
   *
   * 'raw': count face-up tags literally, including Leavitt Station.
   * 'default': Same as raw, but include the wild tags.
   * 'milestone': Same as raw with special conditions for milestones (Chimera)
   * 'award': Same as raw with special conditions for awards (Chimera)
   * 'vps': Same as raw, but include event tags.
   * 'raw-pf': Same as raw, but includes Mars Tags when tag is Science  (Habitat Marte)
   */
  public count(tag: Tag, mode: 'default' | 'raw' | 'milestone' | 'award' | 'vps' | 'raw-pf' = 'default') {
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
      // Milestones don't count wild tags, so in this case one will be added.
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
  public cardTagCount(card: ICard, target: Tag): number {
    let count = 0;
    for (const tag of card.tags) {
      if (tag === target) count++;
      if (tag === Tag.MARS && target === Tag.SCIENCE &&
        this.player.isCorporation(CardName.HABITAT_MARTE)) {
        count++;
      }
      if (tag === Tag.MOON &&
        target === Tag.EARTH &&
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
      if (!includeEventsTags && card.cardType === CardType.EVENT) return;
      if (isICorporationCard(card) && card.isDisabled) return;
      tagCount += card.tags.filter((cardTag) => cardTag === tag).length;
    });

    return tagCount;
  }

  // Return the total number of tags assocaited with these types.
  // Tag substitutions are included
  public multipleCount(tags: Array<Tag>, mode: 'default' | 'milestones' = 'default'): number {
    let tagCount = 0;
    tags.forEach((tag) => {
      tagCount += this.rawCount(tag, false);
    });

    // This is repeated behavior from getTagCount, sigh, OK.
    if (tags.includes(Tag.EARTH) && !tags.includes(Tag.MOON) && this.player.cardIsInEffect(CardName.EARTH_EMBASSY)) {
      tagCount += this.rawCount(Tag.MOON, false);
    }

    tagCount += this.rawCount(Tag.WILD, false);

    // Chimera has 2 wild tags but should only count as one for milestones.
    if (this.player.isCorporation(CardName.CHIMERA) && mode === 'milestones') tagCount--;

    return tagCount;
  }

  // Counts the number of distinct tags
  public distinctCount(mode: 'default' | 'milestone' | 'globalEvent', extraTag?: Tag): number {
    let wildTagCount = 0;
    const uniqueTags = new Set<Tag>();
    const addTag = (tag: Tag) => {
      if (tag === Tag.WILD) {
        wildTagCount++;
      } else {
        uniqueTags.add(tag);
      }
    };
    if (extraTag !== undefined) {
      uniqueTags.add(extraTag);
    }

    for (const card of this.player.corporations) {
      if (!card.isDisabled) {
        card.tags.forEach(addTag);
      }
    }
    for (const card of this.player.playedCards) {
      if (card.cardType !== CardType.EVENT) {
        card.tags.forEach(addTag);
      }
    }
    // Leavitt Station hook
    if (this.player.scienceTagCount > 0) uniqueTags.add(Tag.SCIENCE);

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

  public gainScienceTag() {
    this.player.scienceTagCount++;
  }
}
