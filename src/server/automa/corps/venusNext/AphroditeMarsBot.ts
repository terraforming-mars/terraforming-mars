import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// C28 Aphrodite
export const APHRODITE_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.APHRODITE,
  description: 'Tag: Plant. Draft: Plant > Animal > Venus. Whenever Venus is raised, earn 2 MC per step.',
  tags: [Tag.PLANT],
  requiredExpansions: ['venus'],
  draftPriority: {type: 'tags', tags: [Tag.PLANT, Tag.ANIMAL, Tag.VENUS]},
  effect: {
    onVenusRaised(marsBot, steps) {
      const mc = 2 * steps;
      marsBot.gainMc(mc);
      marsBot.game.log('MarsBot (Aphrodite): Venus raised ${0} step(s), +${1} M€', (b) => b.number(steps).number(mc));
    },
  },
};
