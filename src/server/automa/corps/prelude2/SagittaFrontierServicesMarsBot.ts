import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {cardTagsIncludingEvent} from '@/server/automa/MarsBotTags';
import {IProjectCard} from '@/server/cards/IProjectCard';

export class SagittaFrontierServicesMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.SAGITTA_FRONTIER_SERVICES,
      description: 'Tags: Power, Event. Setup: +8 M€. Tagless cards pay double the Failed Action (10 M€ instead of 5). 1-tag cards earn 1 extra M€.',
      tags: [Tag.POWER, Tag.EVENT],
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.gainMc(8);
    marsBot.game.log('MarsBot (${0}): +8:r:mc:', (b) => b.cardName(this.name));
  }

  // Tagless card: double the Failed Action (10 M€ instead of 5, 6 instead of 3 on Easy). 1-tag card: +1 M€.
  public override onProjectCardResolved(marsBot: IMarsBot, card: IProjectCard): void {
    const tagCount = cardTagsIncludingEvent(card).length;
    if (tagCount === 0) {
      const extra = marsBot.failedActionMc;
      marsBot.gainMc(extra);
      marsBot.game.log('MarsBot (${0}): tagless card, Failed Action pays ${1}:r:mc: more', (b) => b.cardName(this.name).number(extra));
    } else if (tagCount === 1) {
      marsBot.gainMc(1);
      marsBot.game.log('MarsBot (${0}): 1-tag card, +1:r:mc:', (b) => b.cardName(this.name));
    }
  }
}
