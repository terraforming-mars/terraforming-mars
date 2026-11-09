import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {cardTagsIncludingEvent} from '@/server/automa/MarsBotTags';

// C45 Spire
export const SPIRE_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.SPIRE,
  description: 'Tag: Earth. Draft: card with most tags. Cards with 2+ tags add 1 science resource. Spend 10 science to place a city and gain 1 TR.',
  tags: [Tag.EARTH],
  draftPriority: {type: 'mostTags'},
  effect: {
    onProjectCardResolved(marsBot, card) {
      const tagCount = cardTagsIncludingEvent(card).length;
      if (tagCount >= 2) {
        marsBot.setCorpState('scienceResources', marsBot.getCorpState('scienceResources') + 1);
        marsBot.game.log(`MarsBot (Spire): card with ${tagCount} tags, +1 science resource`);
      }
    },
  },
  beforeActionPhase(marsBot) {
    const science = marsBot.getCorpState('scienceResources');
    if (science >= 10) {
      marsBot.setCorpState('scienceResources', science - 10);
      marsBot.placeCity();
      marsBot.raiseTR(1);
      marsBot.game.log('MarsBot (Spire): spent 10 science, placed city + TR +1');
    }
  },
};
