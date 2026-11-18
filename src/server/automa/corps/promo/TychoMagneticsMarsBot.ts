import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class TychoMagneticsMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.TYCHO_MAGNETICS,
      description: 'Draft: Power > Science. Setup: add Interface Hyperlink to the bottom of the bonus deck.',
      draftPriority: {type: 'tags', tags: [Tag.POWER, Tag.SCIENCE]},
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.addBonusCardToBottomOfBonusDeck(BonusCardId.B30_INTERFACE_HYPERLINK);
    marsBot.game.log('MarsBot (Tycho Magnetics): Interface Hyperlink added to the bottom of the bonus deck');
  }
}
