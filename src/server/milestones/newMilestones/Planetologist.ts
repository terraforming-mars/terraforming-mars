import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';

export class Planetologist extends BaseMilestone {
  constructor() {
    super(
      'Planetologist',
      'Have 2 Earth tags, 2 Venus tags, and 2 Jovian tags',
      6,
    );
  }

  public getScore(player: IPlayer): number {
    let score = 0;
    let wildTags = player.tags.count(Tag.WILD);

    const earthTags = player.tags.count(Tag.EARTH) - wildTags;
    const venusTags = player.tags.count(Tag.VENUS) - wildTags;
    const jovianTags = player.tags.count(Tag.JOVIAN) - wildTags;
    // I am glad I am not IT, othweriwse I feel I should be ashamed for code below...
    // Earth tags
    if (earthTags >= 2) {
      score += 2;
    } else if (earthTags === 1 && wildTags > 0) {
      score += 2;
      wildTags--;
    } else if (earthTags === 1) {
      score += 1;
    } else if (earthTags === 0 && wildTags >= 2) {
      score += 2;
      wildTags--;
    } else if (earthTags === 0 && wildTags === 1) {
      score += 1;
      wildTags--;
    }

    // Venus tags
    if (venusTags >= 2) {
      score += 2;
    } else if (venusTags === 1 && wildTags > 0) {
      score += 2;
      wildTags--;
    } else if (venusTags === 1) {
      score += 1;
    } else if (venusTags === 0 && wildTags >= 2) {
      score += 2;
      wildTags--;
    } else if (venusTags === 0 && wildTags === 1) {
      score += 1;
      wildTags--;
    }

    // Jovian tags
    if (jovianTags >= 2) {
      score += 2;
    } else if (jovianTags === 1 && wildTags > 0) {
      score += 2;
      wildTags--;
    } else if (jovianTags === 1) {
      score += 1;
    } else if (jovianTags === 0 && wildTags >= 2) {
      score += 2;
      wildTags--;
    } else if (jovianTags === 0 && wildTags === 1) {
      score += 1;
      wildTags--;
    }

    return score;
  }
}
