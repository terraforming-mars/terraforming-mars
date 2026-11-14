import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// ---- C08 Saturn Systems ----
// Tags: Jovian, Space x3. Draft: Jovian > Space.
// Effect: anyone plays Jovian -> advance event track (index 2).
export const SATURN_SYSTEMS_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.SATURN_SYSTEMS,
  description: 'Tags: Jovian, 3 Space. Draft: Jovian > Space. When you play a Jovian card or MarsBot resolves a Jovian tag (starting tag included), advance event track.',
  tags: [Tag.JOVIAN, Tag.SPACE, Tag.SPACE, Tag.SPACE],
  draftPriority: {type: 'tags', tags: [Tag.JOVIAN, Tag.SPACE]},
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.tags.includes(Tag.JOVIAN)) {
        marsBot.advanceTrack(2);
        marsBot.game.log('MarsBot (Saturn Systems): Jovian tag played, advance event track');
      }
    },
    onHumanCardPlayed(marsBot, card) {
      if (card.tags.includes(Tag.JOVIAN)) {
        marsBot.advanceTrack(2);
        marsBot.game.log('MarsBot (Saturn Systems): Human played Jovian, advance event track');
      }
    },
  },
};
