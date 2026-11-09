import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// C41 Kuiper Cooperative
export const KUIPER_COOPERATIVE_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.KUIPER_COOPERATIVE,
  description: 'Tag: Space. Draft: Space. White and black cubes on space track. White: temperature +1. Black: place ocean.',
  tags: [Tag.SPACE],
  draftPriority: {type: 'tags', tags: [Tag.SPACE]},
  trackCubes: [
    {trackIndex: 1, position: 4, cubeType: 'white'},
    {trackIndex: 1, position: 8, cubeType: 'white'},
    {trackIndex: 1, position: 12, cubeType: 'white'},
    {trackIndex: 1, position: 7, cubeType: 'black'},
    {trackIndex: 1, position: 10, cubeType: 'black'},
    {trackIndex: 1, position: 14, cubeType: 'black'},
  ],
  effect: {
    onTrackCubeTrigger(marsBot, _trackIndex, _position, cubeType) {
      if (cubeType === 'white') {
        marsBot.raiseTemperature(1);
        marsBot.game.log('MarsBot (Kuiper): white cube: temperature +1');
      } else if (cubeType === 'black') {
        marsBot.placeOcean();
        marsBot.game.log('MarsBot (Kuiper): black cube: place ocean');
      }
    },
  },
};
