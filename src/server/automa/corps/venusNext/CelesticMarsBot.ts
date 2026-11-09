import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {floaterAtRoundStart} from '@/server/automa/corps/BaseGameCorps';

// C26 Celestic
export const CELESTIC_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.CELESTIC,
  description: 'Tag: Venus. Draft: Venus > Jovian. Setup: +1 floater. Each Failed Action: +1 floater. Each round start: +1 floater.',
  tags: [Tag.VENUS],
  requiredExpansions: ['venus', 'colonies'],
  draftPriority: {type: 'tags', tags: [Tag.VENUS, Tag.JOVIAN]},
  setup(marsBot) {
    marsBot.addFloaters(1);
    marsBot.game.log('MarsBot (Celestic): +1 floater');
  },
  effect: {
    onFailedAction(marsBot) {
      marsBot.addFloaters(1);
      marsBot.game.log('MarsBot (Celestic): Failed Action, +1 floater');
    },
  },
  roundStart: floaterAtRoundStart('Celestic'),
};
