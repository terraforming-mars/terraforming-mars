import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class AphroditeMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.APHRODITE,
      description: 'Tag: Plant. Draft: Plant > Animal > Venus. Whenever Venus is raised, earn 2 M€ per step.',
      tags: [Tag.PLANT],
      requiredExpansions: ['venus'],
      draftPriority: {type: 'tags', tags: [Tag.PLANT, Tag.ANIMAL, Tag.VENUS]},
    });
  }

  public override onVenusRaised(marsBot: IMarsBot, steps: number): void {
    const mc = 2 * steps;
    marsBot.gainMc(mc);
    marsBot.game.log('MarsBot (${0}): Venus raised ${1} step(s), +${2}:r:mc:', (b) => b.cardName(this.name).number(steps).number(mc));
  }
}
