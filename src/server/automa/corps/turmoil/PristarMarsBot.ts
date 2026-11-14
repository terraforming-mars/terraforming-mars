import {CardName} from '@/common/cards/CardName';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// C36 Pristar (NamuWiki says "Freestar")
export const PRISTAR_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.PRISTAR,
  description: 'When a global parameter would be raised and a cube is on card: skip the raise, remove cube, +1 TR, +6 MC. Cube is restored each generation.',
  tags: [],
  effect: {
    interceptGlobalParameterRaise(marsBot, _parameter) {
      const cube = marsBot.getCorpState('whiteCubeOnCard');
      if (cube > 0) {
        marsBot.setCorpState('whiteCubeOnCard', 0);
        marsBot.raiseTR(1);
        marsBot.gainMc(6);
        marsBot.game.log('MarsBot (Pristar): parameter raise intercepted: removed cube, +1 TR, +6 M€, SKIP raise');
        return true; // SKIP the parameter raise
      }
      return false;
    },
  },
  beforeActionPhase(marsBot) {
    if (marsBot.getCorpState('whiteCubeOnCard') === 0) {
      marsBot.setCorpState('whiteCubeOnCard', 1);
      marsBot.game.log('MarsBot (Pristar): added white cube on card');
    }
  },
};
