import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class RecyclonMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.RECYCLON,
      description: 'Tag: Microbe. Draft: Building. White cubes on building track. Each white cube advances the plant track.',
      tags: [Tag.MICROBE],
      draftPriority: {type: 'tags', tags: [Tag.BUILDING]},
      trackCubes: [
        {trackIndex: 0, position: 3, cubeType: 'white'},
        {trackIndex: 0, position: 6, cubeType: 'white'},
        {trackIndex: 0, position: 9, cubeType: 'white'},
        {trackIndex: 0, position: 12, cubeType: 'white'},
        {trackIndex: 0, position: 15, cubeType: 'white'},
        {trackIndex: 0, position: 18, cubeType: 'white'},
      ],
    });
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, trackIndex: number, _position: number, cubeType: CubeType): void {
    if (cubeType === 'white' && trackIndex === 0) {
      marsBot.advanceTrack(6); // Plant track = index 6
      marsBot.game.log('MarsBot (Recyclon): white cube on building track: advance plant track');
    }
  }
}
