import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// C16 Valley Trust
export const VALLEY_TRUST_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.VALLEY_TRUST,
  description: 'Draft: Science. Setup: draw 1 card. White cubes on science track: draw and resolve a card each.',
  tags: [],
  requiredExpansions: ['prelude'],
  draftPriority: {type: 'tags', tags: [Tag.SCIENCE]},
  setup(marsBot) {
    marsBot.drawProjectCardsToActionDeck(1); // "Obtain 1 card"
    marsBot.game.log('MarsBot (Valley Trust): drew 1 card');
  },
  trackCubes: [
    {trackIndex: 3, position: 8, cubeType: 'white'},
    {trackIndex: 3, position: 16, cubeType: 'white'},
  ],
  effect: {
    onTrackCubeTrigger(marsBot, _trackIndex, _position, cubeType) {
      if (cubeType === 'white') {
        marsBot.maybeDrawAndResolveProjectCard();
        marsBot.game.log('MarsBot (Valley Trust): white cube: drew and resolved 1 card');
      }
    },
  },
};
