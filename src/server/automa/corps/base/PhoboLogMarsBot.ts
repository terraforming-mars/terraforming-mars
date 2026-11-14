import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// ---- C07 Phobolog ----
// Tag: Space. Setup: draw 2 space cards to bonus deck. White cubes on space track.
// Effect: white cube resolves 1 bonus card.
export const PHOBOLOG_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.PHOBOLOG,
  description: 'Tag: Space. Setup: draw 2 space cards to bonus deck. White cubes on space track: resolve 1 bonus card each.',
  tags: [Tag.SPACE],
  trackCubes: [
    {trackIndex: 1, position: 7, cubeType: 'white'},
    {trackIndex: 1, position: 10, cubeType: 'white'},
    {trackIndex: 1, position: 13, cubeType: 'white'},
    {trackIndex: 1, position: 15, cubeType: 'white'},
  ],
  setup(marsBot) {
    marsBot.addProjectCardsToBonusDeck(Tag.SPACE, 2);
    marsBot.game.log('MarsBot (Phobolog): 2 space cards drawn and added to bonus deck');
  },
  effect: {
    onTrackCubeTrigger(marsBot, _trackIndex, _position, cubeType) {
      if (cubeType === 'white') {
        marsBot.maybeDrawAndResolveBonusCard();
        marsBot.game.log('MarsBot (Phobolog): white cube: resolved 1 bonus card');
      }
    },
  },
};
