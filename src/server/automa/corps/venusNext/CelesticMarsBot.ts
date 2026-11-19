import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {addFloaterAtRoundStart} from '@/server/automa/corps/corpHelpers';

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
    marsBot.game.log('MarsBot (${0}): +1 floater', (b) => b.cardName(this.name));
  }

  public override onFailedAction(marsBot: IMarsBot): void {
    marsBot.addFloaters(1);
    marsBot.game.log('MarsBot (${0}): Failed Action, +1 floater', (b) => b.cardName(this.name));
  }

  public override roundStart(marsBot: IMarsBot): void {
    addFloaterAtRoundStart(marsBot, this.name);
  }
}
