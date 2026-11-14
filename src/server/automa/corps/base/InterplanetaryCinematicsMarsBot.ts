import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {whiteTrackCubes} from '@/server/automa/corps/BaseGameCorps';

// ---- C04 Interplanetary Cinematics ----
// Tags: Event, Event. Setup: replace transparent cubes on building/event tracks with white cubes.
// Effect: each advance on building (track 1) or event (track 3), earn 2 MC.
export const INTERPLANETARY_CINEMATICS_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.INTERPLANETARY_CINEMATICS,
  description: 'Tags: 2 Events. White cubes on building and event tracks. Each advance on those tracks, starting tags included, earns 2 MC.',
  tags: [Tag.EVENT, Tag.EVENT],
  trackCubes: [...whiteTrackCubes(0), ...whiteTrackCubes(2)],
  trackCubesTriggerEveryAdvance: true,
  effect: {
    onTrackCubeTrigger(marsBot, trackIndex, _position, cubeType) {
      if (cubeType === 'white' && (trackIndex === 0 || trackIndex === 2)) {
        marsBot.gainMc(2);
        marsBot.game.log('MarsBot (IC): advance on building/event track, +2 M€');
      }
    },
  },
};
