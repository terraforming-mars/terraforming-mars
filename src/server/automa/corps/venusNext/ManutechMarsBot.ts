import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// C29 Manutech: black reminder cubes at #5/#12 on each track
export const MANUTECH_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.MANUTECH,
  description: 'Tag: Building. When any track (including Venus) reaches #5 or #12, after resolving that space, advance it one more space and resolve that one too.',
  tags: [Tag.BUILDING],
  // Track 7 is Venus. Setup leaves out cubes for tracks the bot does not have.
  trackCubes: Array.from({length: 8}, (_, i) => [
    {trackIndex: i, position: 5, cubeType: 'black' as const},
    {trackIndex: i, position: 12, cubeType: 'black' as const},
  ]).flat(),
  effect: {
    afterTrackSpaceResolved(marsBot, trackIndex, position) {
      if (position === 5 || position === 12) {
        marsBot.game.log(`MarsBot (Manutech): track ${trackIndex + 1} reached #${position}, advance 1 more`);
        marsBot.advanceTrack(trackIndex);
      }
    },
  },
};
