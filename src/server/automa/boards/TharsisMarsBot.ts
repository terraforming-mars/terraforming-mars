import {Tag} from '../../../common/cards/Tag';
import {MarsBotBoardData, TrackDefinition} from '../../../common/automa/AutomaTypes';

const TRACK_1_BUILDING: TrackDefinition = {
  num: 1,
  tags: [Tag.BUILDING],
  productions: ['Steel'],
  layout: [null, null, 'ocean', null, null, 'tr2', 'temperature', 'milestone', 'greenery', 'award', 'city', 'tag_2', 'ocean', null, 'greenery', 'city', 'temperature', null, 'tr5'],
};

const TRACK_2_SPACE: TrackDefinition = {
  num: 2,
  tags: [Tag.SPACE],
  productions: ['Titanium'],
  layout: [null, 'advance', null, 'temperature', null, 'ocean', 'city', 'venus', 'milestone', 'temperature', null, 'tr3', 'ocean', null, 'temperature', null, 'tr4', null, 'tr6'],
};

const TRACK_3_EVENT: TrackDefinition = {
  num: 3,
  tags: [Tag.EVENT],
  productions: ['MC'],
  layout: [null, 'advance', null, 'ocean', 'greenery', 'advance', 'venus2', 'advance', 'ocean', 'tr3', 'award', null, 'tr4', 'temperature', 'greenery', 'advance', 'temperature2', null, 'tr5'],
};

const TRACK_4_SCIENCE: TrackDefinition = {
  num: 4,
  tags: [Tag.SCIENCE],
  productions: [],
  layout: [null, 'advance', null, 'advance', 'city', null, 'greenery', null, 'tr2', 'milestone', 'temperature', 'ocean', 'tr3', 'temperature', 'tr4', 'advance', null, 'temperature', 'tr7'],
};

const TRACK_5_ENERGY: TrackDefinition = {
  num: 5,
  tags: [Tag.POWER, Tag.JOVIAN],
  productions: ['Electricity'],
  layout: [null, 'advance', 'venus', 'tr3', 'venus2', 'temperature', 'advance', 'milestone', null, 'temperature', 'greenery', 'advance', 'ocean', null, 'city', 'greenery', null, 'temperature', 'tr8'],
};

const TRACK_6_EARTH: TrackDefinition = {
  num: 6,
  tags: [Tag.EARTH, Tag.CITY],
  productions: ['Heat'],
  layout: [null, 'city', null, null, 'tr3', 'city', null, 'advance', 'city', 'award', 'advance', 'city', 'greenery', 'tr4', 'greenery', 'advance', null, 'city', 'tr7'],
};

const TRACK_7_PLANT: TrackDefinition = {
  num: 7,
  tags: [Tag.PLANT, Tag.ANIMAL, Tag.MICROBE],
  productions: ['Plants'],
  layout: [null, null, null, 'greenery', null, 'greenery', 'greenery', 'advance', null, 'ocean', 'award', 'temperature', 'tr3', 'greenery', 'greenery', 'ocean', 'greenery', null, 'tr6'],
};

export const THARSIS_MARSBOT_BOARD: MarsBotBoardData = {
  trackDefs: [
    TRACK_1_BUILDING,
    TRACK_2_SPACE,
    TRACK_3_EVENT,
    TRACK_4_SCIENCE,
    TRACK_5_ENERGY,
    TRACK_6_EARTH,
    TRACK_7_PLANT,
  ],
  awardFormulas: {
    'Landlord': 'tiles owned on board',
    'Banker': 'track 1 + track 3',
    'Scientist': 'track 4',
    'Thermalist': 'track 5 + 5',
    'Miner': 'track 2 + 5',
  },
  milestoneCriteria: {
    'Terraformer': 'reached 35 TR',
    'Mayor': 'owns 3+ cities',
    'Gardener': 'owns 3+ greenery',
    'Builder': 'reached space 8 on track 1',
    'Planner': 'reached space 4 on every track',
  },
};
