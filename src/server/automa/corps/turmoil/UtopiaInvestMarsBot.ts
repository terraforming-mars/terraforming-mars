import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {bonusCardBeforeActionPhase} from '@/server/automa/corps/BaseGameCorps';

// C39 Utopia Invest
export const UTOPIA_INVEST_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.UTOPIA_INVEST,
  description: 'Tags: Building, Space. Each generation: add Investors bonus card to action deck.',
  tags: [Tag.BUILDING, Tag.SPACE],
  ...bonusCardBeforeActionPhase(BonusCardId.B32_INVESTORS, 'Utopia Invest'),
};
