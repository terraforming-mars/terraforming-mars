import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {SurveyMission} from '../../../src/server/cards/pathfinders/SurveyMission';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';
import {EmptyBoard} from '../../testing/EmptyBoard';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {Space} from '../../../src/server/boards/Space';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {MiningGuild} from '../../../src/server/cards/corporation/MiningGuild';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {Units} from '../../../src/common/Units';
import {cast} from '../../../src/common/utils/utils';

function toSpaceIdDigit(space: Space) {
  return parseInt(space.id);
}

describe('SurveyMission', () => {
  let card: SurveyMission;
  let player: TestPlayer;
  let game: IGame;
  let board: EmptyBoard;

  // The map will be all oceans, except for the spaces
  // below.
  //
  //    3  4  5
  //   8  O 10 11
  //  O 15 16 17
  //
  // O is an ocean space, and G is another claimed space.

  beforeEach(() => {
    card = new SurveyMission();
    [game, player] = testGame(1, {pathfindersExpansion: true});
    board = EmptyBoard.newInstance();
    const availableSpaces = [
      '03', '04', '05',
      '08', '10', '11',
      '15', '16', '17',
    ];
    board.spaces.forEach((space) => {
      if (!availableSpaces.includes(space.id)) {
        space.spaceType = SpaceType.OCEAN;
      }
    });
    game.board = board;
  });

  it('Cannot play if map is clogged', () => {
    expect(card.canPlay(player)).is.true;
    board.getSpaceOrThrow('10').tile = {tileType: TileType.GREENERY};
    expect(card.canPlay(player)).is.false;
  });

  it('Play', () => {
    const selectSpace = cast(card.play(player), SelectSpace);

    // Available triplets are
    // 4, 5, 10
    // 5, 10, 11
    // 10, 16, 17
    // 10, 11, 17

    expect(board.getSpaceOrThrow('04').player?.id).is.undefined;
    expect(board.getSpaceOrThrow('05').player?.id).is.undefined;
    expect(board.getSpaceOrThrow('10').player?.id).is.undefined;

    expect(selectSpace.spaces.map(toSpaceIdDigit)).has.members([4, 5, 10, 11, 16, 17]);

    // So if I pick space 4, only 5 and 10 will be avialable.
    const nextSpace = cast(selectSpace.cb(board.getSpaceOrThrow('04')), SelectSpace);
    expect(board.getSpaceOrThrow('04').player?.id).eq(player.id);
    expect(nextSpace.spaces.map(toSpaceIdDigit)).has.members([5, 10]);

    const lastSpace = cast(nextSpace.cb(board.getSpaceOrThrow('10')), SelectSpace);
    expect(board.getSpaceOrThrow('10').player?.id).eq(player.id);

    expect(lastSpace.spaces.map(toSpaceIdDigit)).has.members([5]);

    expect(lastSpace.cb(board.getSpaceOrThrow('05'))).is.undefined;
    expect(board.getSpaceOrThrow('05').player?.id).eq(player.id);
  });

  it('Gaining bonuses', () => {
    expect(player.heat).eq(0);
    expect(player.plants).eq(0);

    const selectSpace = cast(card.play(player), SelectSpace);
    const space = board.getSpaceOrThrow('04');
    space.bonus = [SpaceBonus.HEAT, SpaceBonus.PLANT];
    selectSpace.cb(space);

    expect(player.heat).eq(1);
    expect(player.plants).eq(1);
  });

  it('Compatible with Mining Guild', () => {
    player.playedCards.push(new MiningGuild());
    const selectSpace = cast(card.play(player), SelectSpace);

    expect(player.steel).eq(5); // Comes from playing the Prelude
    expect(player.plants).eq(0);
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);

    const space = board.getSpaceOrThrow('04');
    space.bonus = [SpaceBonus.STEEL, SpaceBonus.PLANT];
    selectSpace.cb(space);
    runAllActions(game);

    expect(player.steel).eq(6);
    expect(player.plants).eq(1);
    expect(player.production.asUnits()).deep.eq(Units.of({steel: 1}));
  });
  it('Protected hazard spaces are included in valid triplets', () => {
    const space10 = board.getSpaceOrThrow('10');
    space10.bonus = [SpaceBonus.HEAT, SpaceBonus.PLANT];

    // Place a protected hazard on space 10 (the center of the test area).
    space10.tile = {tileType: TileType.DUST_STORM_MILD, protectedHazard: true};

    expect(card.canPlay(player)).is.true;

    const selectSpace = cast(card.play(player), SelectSpace);
    expect(selectSpace.spaces).to.include(space10);

    selectSpace.cb(space10);
    expect(player.heat).eq(0);
    expect(player.plants).eq(0);
  });

  it('ArcadianCommunities-marked spaces are excluded from valid triplets', () => {
    // Mark space 04 (part of triplet [4,5,10] only), leaving other triplets valid.
    const space04 = board.getSpaceOrThrow('04');
    space04.player = player;

    // Space 04 is excluded but triplets [5,10,11], [10,16,17], [10,11,17] remain.
    expect(card.canPlay(player)).is.true;

    const selectSpace = cast(card.play(player), SelectSpace);
    expect(selectSpace.spaces).not.to.include(space04);
    expect(selectSpace.spaces.map(toSpaceIdDigit)).to.have.members([5, 10, 11, 16, 17]);
  });
});
