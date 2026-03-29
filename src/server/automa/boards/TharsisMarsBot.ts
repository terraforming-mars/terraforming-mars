import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {TrackDefinition} from '../../../common/automa/AutomaTypes';

const TRACK_BUILDING: TrackDefinition = {
  tags: [Tag.BUILDING],
  productions: [Resource.STEEL],
  layout: [undefined, undefined, 'ocean', undefined, undefined, 'tr2', 'temperature', 'milestone', 'greenery', 'award', 'city', 'tag_1', 'ocean', undefined, 'greenery', 'city', 'temperature', undefined, 'tr5'],
};

const TRACK_SPACE: TrackDefinition = {
  tags: [Tag.SPACE],
  productions: [Resource.TITANIUM],
  layout: [undefined, 'advance', undefined, 'temperature', undefined, 'ocean', 'city', 'venus', 'milestone', 'temperature', undefined, 'tr3', 'ocean', undefined, 'temperature', undefined, 'tr4', undefined, 'tr6'],
};

const TRACK_EVENT: TrackDefinition = {
  tags: [Tag.EVENT],
  productions: [Resource.MEGACREDITS],
  layout: [undefined, 'advance', undefined, 'ocean', 'greenery', 'advance', 'venus2', 'advance', 'ocean', 'tr3', 'award', undefined, 'tr4', 'temperature', 'greenery', 'advance', 'temperature2', undefined, 'tr5'],
};

const TRACK_SCIENCE: TrackDefinition = {
  tags: [Tag.SCIENCE],
  productions: [],
  layout: [undefined, 'advance', undefined, 'advance', 'city', undefined, 'greenery', undefined, 'tr2', 'milestone', 'temperature', 'ocean', 'tr3', 'temperature', 'tr4', 'advance', undefined, 'temperature', 'tr7'],
};

const TRACK_ENERGY: TrackDefinition = {
  tags: [Tag.POWER, Tag.JOVIAN],
  productions: [Resource.ENERGY],
  layout: [undefined, 'advance', 'venus', 'tr3', 'venus2', 'temperature', 'advance', 'milestone', undefined, 'temperature', 'greenery', 'advance', 'ocean', undefined, 'city', 'greenery', undefined, 'temperature', 'tr8'],
};

const TRACK_EARTH: TrackDefinition = {
  tags: [Tag.EARTH, Tag.CITY],
  productions: [Resource.HEAT],
  layout: [undefined, 'city', undefined, undefined, 'tr3', 'city', undefined, 'advance', 'city', 'award', 'advance', 'city', 'greenery', 'tr4', 'greenery', 'advance', undefined, 'city', 'tr7'],
};

const TRACK_PLANT: TrackDefinition = {
  tags: [Tag.PLANT, Tag.ANIMAL, Tag.MICROBE],
  productions: [Resource.PLANTS],
  layout: [undefined, undefined, undefined, 'greenery', undefined, 'greenery', 'greenery', 'advance', undefined, 'ocean', 'award', 'temperature', 'tr3', 'greenery', 'greenery', 'ocean', 'greenery', undefined, 'tr6'],
};

export const THARSIS_MARSBOT_BOARD: ReadonlyArray<TrackDefinition> = [
  TRACK_BUILDING,
  TRACK_SPACE,
  TRACK_EVENT,
  TRACK_SCIENCE,
  TRACK_ENERGY,
  TRACK_EARTH,
  TRACK_PLANT,
];
