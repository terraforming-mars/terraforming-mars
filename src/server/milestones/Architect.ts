import {TagBasedMilestone} from './TagBasedMilestone';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Architect extends TagBasedMilestone {
  public readonly automaDescription = 'Science/City track ≥ 6';
  constructor() {
    super('Architect', 'Have 3 city tags in play', 3, [Tag.CITY]);
  }

  /** MarsBot needs space 6 of the track that carries City (rulebook C p.9). */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.marsBotBoard.trackPosition(Tag.CITY) >= 6;
  }
}
