import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {whiteLeastBlackSpaceHandler} from '@/server/automa/corps/BaseGameCorps';

// C14 Point Luna: white+black cubes on Earth track (track 6)
export const POINT_LUNA_MARSBOT_CORP: IMarsBotCorp = {
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
  effect: {
    onTrackCubeTrigger(marsBot, _trackIndex, _position, cubeType) {
      whiteLeastBlackSpaceHandler(marsBot, cubeType, 'Point Luna');
    },
  },
};
