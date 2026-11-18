import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {addFloaterAtRoundStart} from '@/server/automa/corps/BaseGameCorps';

export class CelesticMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.CELESTIC,
      description: 'Tag: Venus. Draft: Venus > Jovian. Setup: +1 floater. Each Failed Action: +1 floater. Each round start: +1 floater.',
      tags: [Tag.VENUS],
      requiredExpansions: ['venus', 'colonies'],
      draftPriority: {type: 'tags', tags: [Tag.VENUS, Tag.JOVIAN]},
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.addFloaters(1);
    marsBot.game.log('MarsBot (Celestic): +1 floater');
  }

  public override onFailedAction(marsBot: IMarsBot): void {
    marsBot.addFloaters(1);
    marsBot.game.log('MarsBot (Celestic): Failed Action, +1 floater');
  }

  public override roundStart(marsBot: IMarsBot): void {
    addFloaterAtRoundStart(marsBot, 'Celestic');
  }
}
