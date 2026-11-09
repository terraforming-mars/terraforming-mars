import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {cardTagsIncludingEvent} from '@/server/automa/MarsBotTags';

// C44 Sagitta
export const SAGITTA_FRONTIER_SERVICES_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.SAGITTA_FRONTIER_SERVICES,
  description: 'Tags: Power, Event. Setup: +8 MC. Tagless cards pay double the Failed Action (10 MC instead of 5). 1-tag cards earn 1 extra MC.',
  tags: [Tag.POWER, Tag.EVENT],
  setup(marsBot) {
    marsBot.gainMc(8);
    marsBot.game.log('MarsBot (Sagitta): +8 M€');
  },
  effect: {
    // Tagless card: double the Failed Action (10 MC instead of 5, 6 instead of 3 on Easy). 1-tag card: +1 MC.
    onProjectCardResolved(marsBot, card) {
      const tagCount = cardTagsIncludingEvent(card).length;
      if (tagCount === 0) {
        const extra = marsBot.failedActionMc;
        marsBot.gainMc(extra);
        marsBot.game.log('MarsBot (Sagitta): tagless card, Failed Action pays ${0} M€ more', (b) => b.number(extra));
      } else if (tagCount === 1) {
        marsBot.gainMc(1);
        marsBot.game.log('MarsBot (Sagitta): 1-tag card, +1 M€');
      }
    },
  },
};
