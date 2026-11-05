import {expect} from 'chai';
import {BoardName} from '@/common/boards/BoardName';
import {Tag} from '@/common/cards/Tag';
import {MARSBOT_MAX_TRACK_POSITION} from '@/common/automa/AutomaTypes';
import {MARSBOT_BOARD_NAMES} from '@/common/automa/MarsBotBoards';
import {MarsBotBoard} from '@/server/automa/MarsBotBoard';
import {MARSBOT_BOARDS} from '@/server/automa/boards/MarsBotBoards';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';

const MARS_TAGS = [Tag.BUILDING, Tag.SPACE, Tag.EVENT, Tag.SCIENCE, Tag.POWER, Tag.JOVIAN, Tag.EARTH, Tag.CITY, Tag.PLANT, Tag.ANIMAL, Tag.MICROBE];

// Track index of each tag on the Tharsis board. Every other map moves a few of them (rulebook C, p.8).
const THARSIS_TAG_TRACKS: Partial<Record<Tag, number>> = {
  [Tag.BUILDING]: 0,
  [Tag.SPACE]: 1,
  [Tag.EVENT]: 2,
  [Tag.SCIENCE]: 3,
  [Tag.POWER]: 4,
  [Tag.JOVIAN]: 4,
  [Tag.EARTH]: 5,
  [Tag.CITY]: 5,
  [Tag.PLANT]: 6,
  [Tag.ANIMAL]: 6,
  [Tag.MICROBE]: 6,
};

const TAG_TRACKS: Partial<Record<BoardName, Partial<Record<Tag, number>>>> = {
  [BoardName.THARSIS]: THARSIS_TAG_TRACKS,
  [BoardName.UTOPIA_PLANITIA]: THARSIS_TAG_TRACKS,
  // Jovian pairs with Science.
  [BoardName.HELLAS]: {...THARSIS_TAG_TRACKS, [Tag.JOVIAN]: 3},
  [BoardName.ELYSIUM]: {...THARSIS_TAG_TRACKS, [Tag.JOVIAN]: 3},
  // Jovian pairs with Earth, City with Science.
  [BoardName.TERRA_CIMMERIA_NOVA]: {...THARSIS_TAG_TRACKS, [Tag.JOVIAN]: 5, [Tag.CITY]: 3},
  // Microbe pairs with Science, City with Energy, Jovian with Earth.
  [BoardName.VASTITAS_BOREALIS_NOVA]: {...THARSIS_TAG_TRACKS, [Tag.MICROBE]: 3, [Tag.CITY]: 4, [Tag.JOVIAN]: 5},
};

describe('MarsBotBoards', () => {
  it('has a board for every MarsBot map, with a Venus variant', () => {
    expect(Object.keys(MARSBOT_BOARDS)).to.have.members(MARSBOT_BOARD_NAMES);
    for (const boardName of MARSBOT_BOARD_NAMES) {
      const {base, withVenus} = MARSBOT_BOARDS[boardName]!;
      expect(withVenus, boardName).deep.eq([...base, VENUS_MARSBOT_TRACK]);
    }
  });

  it('lays out seven tracks from an empty start to a TR finish', () => {
    for (const boardName of MARSBOT_BOARD_NAMES) {
      const {base} = MARSBOT_BOARDS[boardName]!;
      expect(base, boardName).has.length(7);
      for (const {layout} of base) {
        expect(layout, boardName).has.length(MARSBOT_MAX_TRACK_POSITION + 1);
        expect(layout[0], boardName).is.undefined;
        expect(layout[MARSBOT_MAX_TRACK_POSITION], boardName).matches(/^tr\d$/);
      }
    }
  });

  it('puts every Mars tag on one track, in the same track order on every map', () => {
    for (const boardName of MARSBOT_BOARD_NAMES) {
      const {base} = MARSBOT_BOARDS[boardName]!;
      for (const tag of MARS_TAGS) {
        expect(base.filter((track) => track.tags.includes(tag)), `${boardName} ${tag}`).has.length(1);
      }
      expect(base.map((track) => track.tags[0]), boardName).deep.eq([Tag.BUILDING, Tag.SPACE, Tag.EVENT, Tag.SCIENCE, Tag.POWER, Tag.EARTH, Tag.PLANT]);
    }
  });

  it('pairs tags on each map as rulebook C, p.8 says', () => {
    for (const boardName of MARSBOT_BOARD_NAMES) {
      const board = new MarsBotBoard(MARSBOT_BOARDS[boardName]!.base);
      expect(board.tagToTrack, boardName).deep.eq(TAG_TRACKS[boardName]);
    }
  });

  it('advances only tracks that exist', () => {
    for (const boardName of MARSBOT_BOARD_NAMES) {
      const board = new MarsBotBoard(MARSBOT_BOARDS[boardName]!.withVenus);
      for (const {layout} of board.definitions) {
        for (const action of layout) {
          if (action?.startsWith('tag_')) {
            expect(Object.keys(board.tagToTrack), `${boardName} ${action}`).includes(action.slice('tag_'.length));
          }
        }
      }
    }
  });

  it('places colonies only on the Utopia Planitia board (rulebook C, p.8)', () => {
    for (const boardName of MARSBOT_BOARD_NAMES) {
      const actions = MARSBOT_BOARDS[boardName]!.base.flatMap((track) => track.layout);
      expect(actions.includes('colony'), boardName).eq(boardName === BoardName.UTOPIA_PLANITIA);
    }
  });
});
