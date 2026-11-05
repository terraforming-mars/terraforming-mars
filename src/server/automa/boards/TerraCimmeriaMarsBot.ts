import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {TrackDefinition} from '../../../common/automa/AutomaTypes';
import {VENUS_MARSBOT_TRACK} from './VenusMarsBot';

const TRACK_BUILDING: TrackDefinition = {
  tags: [Tag.BUILDING],
  productions: [Resource.STEEL],
  layout: [undefined, undefined, 'ocean', undefined, 'tag_power', undefined, 'temperature', 'milestone', 'greenery', 'award', 'city', undefined, 'ocean', 'tag_power', 'greenery', 'city', 'temperature', undefined, 'tr5'],
};

const TRACK_SPACE: TrackDefinition = {
  tags: [Tag.SPACE],
  productions: [Resource.TITANIUM],
  layout: [undefined, 'advance', undefined, 'temperature', undefined, 'ocean', 'city', 'venus', 'milestone', 'temperature', undefined, 'tr4', 'ocean', undefined, 'temperature', undefined, 'tr5', undefined, 'tr6'],
};

const TRACK_EVENT: TrackDefinition = {
  tags: [Tag.EVENT],
  productions: [Resource.MEGACREDITS],
  layout: [undefined, 'advance', undefined, 'ocean', 'greenery', 'advance', 'floater2', 'advance', 'ocean', 'tr3', 'award', undefined, 'tr4', 'temperature', 'greenery', 'advance', 'temperature2', undefined, 'tr5'],
};

const TRACK_SCIENCE: TrackDefinition = {
  tags: [Tag.SCIENCE, Tag.CITY],
  productions: [],
  layout: [undefined, 'advance', undefined, 'city', undefined, 'city', 'greenery', 'tag_event', 'milestone', undefined, 'city', 'ocean', 'tr3', 'temperature', 'tr4', 'advance', undefined, 'temperature', 'tr7'],
};

const TRACK_ENERGY: TrackDefinition = {
  tags: [Tag.POWER],
  productions: [Resource.ENERGY],
  layout: [undefined, 'advance', undefined, 'tr3', undefined, 'temperature', 'advance', 'award', undefined, 'temperature', 'greenery', 'advance', 'ocean', undefined, 'city', 'greenery', undefined, 'temperature', 'tr8'],
};

const TRACK_EARTH: TrackDefinition = {
  tags: [Tag.EARTH, Tag.JOVIAN],
  productions: [Resource.HEAT],
  layout: [undefined, 'city', 'floater', undefined, 'temperature', 'floater2', undefined, 'advance', undefined, 'award', 'advance', 'city', 'greenery', 'tr4', 'greenery', 'advance', undefined, 'city', 'tr7'],
};

const TRACK_PLANT: TrackDefinition = {
  tags: [Tag.PLANT, Tag.ANIMAL, Tag.MICROBE],
  productions: [Resource.PLANTS],
  layout: [undefined, undefined, undefined, 'greenery', undefined, 'greenery', 'greenery', 'advance', undefined, 'ocean', 'milestone', 'temperature', 'tr4', 'greenery', 'greenery', 'ocean', 'greenery', undefined, 'tr6'],
};

export const TERRA_CIMMERIA_MARSBOT_BOARD: ReadonlyArray<TrackDefinition> = [
  TRACK_BUILDING,
  TRACK_SPACE,
  TRACK_EVENT,
  TRACK_SCIENCE,
  TRACK_ENERGY,
  TRACK_EARTH,
  TRACK_PLANT,
];

export const TERRA_CIMMERIA_MARSBOT_BOARD_WITH_VENUS: ReadonlyArray<TrackDefinition> = [
  ...TERRA_CIMMERIA_MARSBOT_BOARD,
  VENUS_MARSBOT_TRACK,
];
