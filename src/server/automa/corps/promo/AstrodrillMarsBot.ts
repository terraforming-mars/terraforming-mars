import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {whiteLeastBlackSpaceHandler} from '@/server/automa/corps/BaseGameCorps';

// C19 Astrodrill Enterprise: white+black cubes on space track
export const ASTRODRILL_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.ASTRODRILL,
  description: 'Draft: Space. White and black cubes on space track. White: advance least-advanced track. Black: advance space track.',
  tags: [],
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
  effect: {
    onTrackCubeTrigger(marsBot, _trackIndex, _position, cubeType) {
      whiteLeastBlackSpaceHandler(marsBot, cubeType, 'Astrodrill');
    },
  },
};
