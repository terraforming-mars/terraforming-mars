import {Tag} from '../../../common/cards/Tag';
import {TrackDefinition} from '../../../common/automa/AutomaTypes';

// Venus MarsBot track (positions 0-12, shorter than main tracks)
export const VENUS_MARSBOT_TRACK: TrackDefinition = {
  tags: [Tag.VENUS],
  productions: [],
  layout: [undefined, 'floater', 'floater2', 'venus', 'floater2', 'venus', undefined, 'floater2', 'venus', 'tag_microbe', 'venus', 'floater2', 'tr5'],
};
