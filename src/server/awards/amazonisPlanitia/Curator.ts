import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

export class Curator implements IAward {
  public readonly name = 'Curator';
  public readonly description = 'Have the most tags of any one type in play';

  public getScore(player: IPlayer): number {
    let max = 0;
    // With Odyssey, events stay face up, so the event tag counts as a tag type.
    if (player.tableau.has(CardName.ODYSSEY)) {
      max = player.getPlayedEventsCount();
      // Chimera counts as one wild tag for awards
      if (player.tableau.has(CardName.CHIMERA)) {
        max++;
      }
    }
    for (const tagString in Tag) {
      if (Object.hasOwn(Tag, tagString)) {
        const tag: Tag = (<any>Tag)[tagString];
        if (tag === Tag.EVENT || tag === Tag.WILD || tag === Tag.CLONE) {
          continue;
        }
        const count = player.tags.count(tag, 'award');
        if (count > max) {
          max = count;
        }
      }
    }

    return max;
  }
}
