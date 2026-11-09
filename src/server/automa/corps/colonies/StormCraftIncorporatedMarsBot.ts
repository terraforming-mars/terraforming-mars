import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {floaterAtRoundStart} from '@/server/automa/corps/BaseGameCorps';

// C34 Stormcraft
export const STORMCRAFT_INCORPORATED_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.STORMCRAFT_INCORPORATED,
  description: 'Tag: Jovian. Setup: +1 floater. Each round start: +1 floater. Spending floaters for an extra card also raises temperature +1.',
  tags: [Tag.JOVIAN],
  requiredExpansions: ['venus', 'colonies'],
  setup(marsBot) {
    marsBot.addFloaters(1);
    marsBot.game.log('MarsBot (Stormcraft): +1 floater');
  },
  effect: {
    onFloatersSpentForExtraCard(marsBot) {
      marsBot.raiseTemperature(1);
      marsBot.game.log('MarsBot (Stormcraft): floaters spent for an extra card, temperature +1');
    },
  },
  roundStart: floaterAtRoundStart('Stormcraft'),
};
