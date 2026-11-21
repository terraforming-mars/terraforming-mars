import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {whiteLeastBlackSpaceHandler} from '@/server/automa/corps/corpHelpers';

export class PointLunaMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.POINT_LUNA,
      description: 'Tag: Space. Draft: Earth. White and black cubes on Earth track. White: advance least-advanced track. Black: advance space track.',
      tags: [Tag.SPACE],
      draftPriority: {type: 'tags', tags: [Tag.EARTH]},
      trackCubes: [
        {trackIndex: 5, position: 1, cubeType: 'white'},
        {trackIndex: 5, position: 5, cubeType: 'white'},
        {trackIndex: 5, position: 9, cubeType: 'white'},
        {trackIndex: 5, position: 13, cubeType: 'white'},
        {trackIndex: 5, position: 17, cubeType: 'white'},
        {trackIndex: 5, position: 3, cubeType: 'black'},
        {trackIndex: 5, position: 7, cubeType: 'black'},
        {trackIndex: 5, position: 11, cubeType: 'black'},
        {trackIndex: 5, position: 15, cubeType: 'black'},
      ],
    });
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, _trackIndex: number, _position: number, cubeType: CubeType): void {
    whiteLeastBlackSpaceHandler(marsBot, cubeType, this.name);
  }
}
