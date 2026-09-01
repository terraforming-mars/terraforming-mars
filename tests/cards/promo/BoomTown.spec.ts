import {expect} from 'chai';
import {BoomTown} from '../../../src/server/cards/promo/BoomTown';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {BoardName} from '../../../src/common/boards/BoardName';
import {EmptyBoard} from '../../testing/EmptyBoard';
import {cast} from '../../../src/common/utils/utils';

describe('BoomTown', () => {
  let card: BoomTown;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new BoomTown();
    [game, player] = testGame(2, {boardName: BoardName.THARSIS});
  });

  it('play', () => {
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.production.titanium).to.eq(2);
    expect(player.getTitaniumValue()).to.eq(2);
  });

  it('play, only offers spaces with a steel or titanium bonus', () => {
    card.play(player);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    // These spaces on Tharsis have the bonuses.
    expect(selectSpace.spaces.map((space) => space.id))
      .to.have.members(['03', '09', '20', '21', '53', '58', '59', '60']);
  });

  it('play, places a city', () => {
    card.play(player);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];

    selectSpace.cb(space);
    runAllActions(game);

    expect(space.player).to.eq(player);
    expect(space.tile?.tileType).to.eq(TileType.CITY);
  });

  it('Can play', () => {
    expect(card.canPlay(player)).is.true;
  });

  it('Cannot play when no space has a steel or titanium bonus', () => {
    game.board = EmptyBoard.newInstance();

    expect(game.board.getAvailableSpacesForType(player, 'city')).is.not.empty;
    expect(card.canPlay(player)).is.false;
  });
});
