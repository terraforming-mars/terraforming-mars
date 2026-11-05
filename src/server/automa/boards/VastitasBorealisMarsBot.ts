import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {TrackDefinition} from '../../../common/automa/AutomaTypes';
import {VENUS_MARSBOT_TRACK} from './VenusMarsBot';

const TRACK_BUILDING: TrackDefinition = {
  tags: [Tag.BUILDING],
  productions: [Resource.STEEL],
  layout: [undefined, 'advance', 'ocean', undefined, undefined, 'tr2', 'temperature', 'milestone', 'greenery', 'award', 'city', 'tag_venus', 'ocean', undefined, 'greenery', 'city', 'temperature', undefined, 'tr5'],
};

const TRACK_SPACE: TrackDefinition = {
  tags: [Tag.SPACE],
  productions: [Resource.TITANIUM],
  layout: [undefined, 'advance', undefined, 'temperature', undefined, 'ocean', 'city', 'venus', 'milestone', 'temperature', undefined, 'tr4', 'ocean', undefined, 'temperature', undefined, 'tr5', undefined, 'tr6'],
};

const TRACK_EVENT: TrackDefinition = {
  tags: [Tag.EVENT],
  productions: [Resource.MEGACREDITS],
  layout: [undefined, 'advance', undefined, 'ocean', 'greenery', 'advance', 'floater2', 'advance', 'ocean', 'tr3', 'award', undefined, 'tr5', 'temperature', 'greenery', 'advance', 'temperature2', undefined, 'tr5'],
};

const TRACK_SCIENCE: TrackDefinition = {
  tags: [Tag.SCIENCE, Tag.MICROBE],
  productions: [],
  layout: [undefined, 'advance', undefined, undefined, 'city', undefined, 'greenery', undefined, 'tr2', 'milestone', 'temperature', 'ocean', 'tr3', 'temperature', 'tr4', 'advance', 'tag_animal', 'temperature', 'tr5'],
};

const TRACK_ENERGY: TrackDefinition = {
  tags: [Tag.POWER, Tag.CITY],
  productions: [Resource.ENERGY],
  layout: [undefined, 'advance', undefined, 'tr3', undefined, 'city', 'advance', 'milestone', undefined, 'city', 'greenery', 'advance', 'ocean', undefined, 'city', 'greenery', undefined, 'temperature', 'tr8'],
};

const TRACK_EARTH: TrackDefinition = {
  tags: [Tag.EARTH, Tag.JOVIAN],
  productions: [Resource.HEAT],
  layout: [undefined, 'city', 'floater', undefined, 'temperature', 'floater2', undefined, 'advance', 'temperature', 'award', 'advance', 'city', 'greenery', 'tr4', 'greenery', 'advance', undefined, 'city', 'tr7'],
};

const TRACK_PLANT: TrackDefinition = {
  tags: [Tag.PLANT, Tag.ANIMAL],
  productions: [Resource.PLANTS],
  layout: [undefined, undefined, 'greenery', undefined, 'greenery', undefined, 'greenery', 'advance', undefined, 'ocean', 'award', 'temperature', 'tr4', 'greenery', 'greenery', 'ocean', 'greenery', undefined, 'tr8'],
};

export const VASTITAS_BOREALIS_MARSBOT_BOARD: ReadonlyArray<TrackDefinition> = [
  TRACK_BUILDING,
  TRACK_SPACE,
  TRACK_EVENT,
  TRACK_SCIENCE,
  TRACK_ENERGY,
  TRACK_EARTH,
  TRACK_PLANT,
];

export const VASTITAS_BOREALIS_MARSBOT_BOARD_WITH_VENUS: ReadonlyArray<TrackDefinition> = [
  ...VASTITAS_BOREALIS_MARSBOT_BOARD,
  VENUS_MARSBOT_TRACK,
];
