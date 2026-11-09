import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {bonusCardBeforeActionPhase} from '@/server/automa/corps/BaseGameCorps';

// ---- C02 Eco Line ----
// Gen effect: before action phase, add Rapid Sprouting (B23) to action deck.
export const ECOLINE_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.ECOLINE,
  description: 'Each generation: add Rapid Sprouting bonus card to action deck. Your cards may remove or steal the plant on this card instead of from MarsBot\'s MC.',
  tags: [],
  ...bonusCardBeforeActionPhase(BonusCardId.B23_RAPID_SPROUTING, 'Eco Line'),
};
