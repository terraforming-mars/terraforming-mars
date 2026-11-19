import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {cardTagsIncludingEvent} from '@/server/automa/MarsBotTags';
import {IProjectCard} from '@/server/cards/IProjectCard';

export class SpireMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.SPIRE,
      description: 'Tag: Earth. Draft: card with most tags. Cards with 2+ tags add 1 science resource. Spend 10 science to place a city and gain 1 TR.',
      tags: [Tag.EARTH],
      draftPriority: {type: 'mostTags'},
    });
  }

  public override onProjectCardResolved(marsBot: IMarsBot, card: IProjectCard): void {
    const tagCount = cardTagsIncludingEvent(card).length;
    if (tagCount >= 2) {
      marsBot.setCorpState('scienceResources', marsBot.getCorpState('scienceResources') + 1);
      marsBot.game.log('MarsBot (${0}): card with ${1} tags, +1 science resource', (b) => b.cardName(this.name).number(tagCount));
    }
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    const science = marsBot.getCorpState('scienceResources');
    if (science >= 10) {
      marsBot.setCorpState('scienceResources', science - 10);
      marsBot.placeCity();
      marsBot.raiseTR(1);
      marsBot.game.log('MarsBot (${0}): spent 10 science, placed city + TR +1', (b) => b.cardName(this.name));
    }
  }
}
