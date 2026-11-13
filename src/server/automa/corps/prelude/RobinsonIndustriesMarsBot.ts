import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {bonusCardBeforeActionPhase} from '@/server/automa/corps/BaseGameCorps';

// C15 Robinson Industries
export const ROBINSON_INDUSTRIES_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.ROBINSON_INDUSTRIES,
  description: 'Setup: +10 MC. Each generation: add Diversification bonus card to action deck.',
  tags: [],
  setup(marsBot) {
    marsBot.gainMc(10);
    marsBot.game.log('MarsBot (Robinson Industries): +10 M€');
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B28_DIVERSIFICATION, 'Robinson Industries'),
};
