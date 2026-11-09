import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {whiteTrackCubes} from '@/server/automa/corps/BaseGameCorps';

// ---- C09 Teractor ----
// Draft: Earth. Setup: +25 MC, white cubes on Earth track (all positions).
// Effect: each advance on Earth track gives +2 MC.
export const TERACTOR_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.TERACTOR,
  description: 'Draft: Earth. Setup: +25 MC, white cubes on Earth track. Each Earth track advance earns 2 MC.',
  tags: [],
  draftPriority: {type: 'tags', tags: [Tag.EARTH]},
  trackCubes: whiteTrackCubes(5),
  trackCubesTriggerEveryAdvance: true,
  setup(marsBot) {
    marsBot.gainMc(25);
    marsBot.game.log('MarsBot (Teractor): +25 M€');
  },
  effect: {
    onTrackCubeTrigger(marsBot, trackIndex, _position, cubeType) {
      if (cubeType === 'white' && trackIndex === 5) {
        marsBot.gainMc(2);
        marsBot.game.log('MarsBot (Teractor): Earth track advance, +2 M€');
      }
    },
  },
};
