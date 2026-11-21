import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {whiteLeastBlackSpaceHandler} from '@/server/automa/corps/corpHelpers';

export class AstrodrillMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.ASTRODRILL,
      description: 'Draft: Space. White and black cubes on space track. White: advance least-advanced track. Black: advance space track.',
      draftPriority: {type: 'tags', tags: [Tag.SPACE]},
      trackCubes: [
        {trackIndex: 1, position: 2, cubeType: 'white'},
        {trackIndex: 1, position: 4, cubeType: 'white'},
        {trackIndex: 1, position: 7, cubeType: 'white'},
        {trackIndex: 1, position: 10, cubeType: 'white'},
        {trackIndex: 1, position: 13, cubeType: 'white'},
        {trackIndex: 1, position: 5, cubeType: 'black'},
        {trackIndex: 1, position: 11, cubeType: 'black'},
        {trackIndex: 1, position: 16, cubeType: 'black'},
      ],
    });
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, _trackIndex: number, _position: number, cubeType: CubeType): void {
    whiteLeastBlackSpaceHandler(marsBot, cubeType, this.name);
  }
}
