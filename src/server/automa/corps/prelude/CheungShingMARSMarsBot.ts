import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {SILVER_CUBE_MC} from '@/server/automa/corps/BaseGameCorps';

// C13 Cheung Shing MARS: silver resource cubes on building track from position 4
export const CHEUNG_SHING_MARS_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.CHEUNG_SHING_MARS,
  description: 'Tag: Building. Draft: Building. Silver resource cubes on building track from position 4; each earns 5 MC.',
  tags: [Tag.BUILDING],
  draftPriority: {type: 'tags', tags: [Tag.BUILDING]},
  // Silver resource cubes at positions 4-18 on building track (track 1)
  trackCubes: Array.from({length: 15}, (_, i) => ({trackIndex: 0, position: i + 4, cubeType: 'credit' as const})),
  effect: {
    onTrackCubeTrigger(marsBot, _trackIndex, _position, cubeType) {
      if (cubeType === 'credit') {
        marsBot.gainMc(SILVER_CUBE_MC);
        marsBot.game.log('MarsBot (Cheung Shing): silver resource cube reached, +5 M€');
      }
    },
  },
};
