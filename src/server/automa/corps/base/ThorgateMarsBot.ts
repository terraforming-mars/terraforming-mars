import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// ---- C11 Thorgate ----
// Tag: Power. Draft: Power. Setup: +10 MC, white cubes on energy track.
// Effect: white cube draws a card and resolves only its first tag, then temperature +1.
export const THORGATE_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.THORGATE,
  description: 'Tag: Power. Draft: Power. Setup: +10 MC, white cubes on energy track. White cube: draw a project card and resolve only its first tag, then raise temperature 1 step.',
  tags: [Tag.POWER],
  draftPriority: {type: 'tags', tags: [Tag.POWER]},
  trackCubes: [
    {trackIndex: 4, position: 4, cubeType: 'white'},
    {trackIndex: 4, position: 6, cubeType: 'white'},
    {trackIndex: 4, position: 8, cubeType: 'white'},
    {trackIndex: 4, position: 10, cubeType: 'white'},
  ],
  setup(marsBot) {
    marsBot.gainMc(10);
    marsBot.game.log('MarsBot (Thorgate): +10 M€');
  },
  effect: {
    onTrackCubeTrigger(marsBot, _trackIndex, _position, cubeType) {
      if (cubeType === 'white') {
        marsBot.maybeDrawAndResolveProjectCardFirstTagOnly();
        marsBot.raiseTemperature(1);
        marsBot.game.log('MarsBot (Thorgate): white cube: resolved card (first tag only) + temp +1');
      }
    },
  },
};
