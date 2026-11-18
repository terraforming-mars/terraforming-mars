import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class ManutechMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.MANUTECH,
      description: 'Tag: Building. When any track (including Venus) reaches #5 or #12, after resolving that space, advance it one more space and resolve that one too.',
      tags: [Tag.BUILDING],
      // Track index 7 is Venus. Setup leaves out cubes for tracks the bot does not have.
      trackCubes: Array.from({length: 8}, (_, i) => [
        {trackIndex: i, position: 5, cubeType: 'black' as const},
        {trackIndex: i, position: 12, cubeType: 'black' as const},
      ]).flat(),
    });
  }

  public override afterTrackSpaceResolved(marsBot: IMarsBot, trackIndex: number, position: number): void {
    if (position === 5 || position === 12) {
      marsBot.game.log(`MarsBot (Manutech): track ${trackIndex + 1} reached #${position}, advance 1 more`);
      marsBot.advanceTrack(trackIndex);
    }
  }
}
