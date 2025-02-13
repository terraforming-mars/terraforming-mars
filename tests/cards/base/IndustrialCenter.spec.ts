import {expect} from 'chai';
import {IndustrialCenter} from '../../../src/server/cards/base/IndustrialCenter';
import {IGame} from '../../../src/server/IGame';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {addCity, cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('IndustrialCenter', () => {
  let card: IndustrialCenter;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new IndustrialCenter();
    [game, player] = testGame(2);
  });

  it('Can not play or act', () => {
    expect(card.canAct(player)).is.not.true;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should action', () => {
    player.megaCredits = 7;
    card.action(player);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.production.steel).to.eq(1);
  });

  it('Should play', () => {
    addCity(player);
    expect(game.board.getCitiesOnMars()).has.length(1);

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(space.tile?.tileType).to.eq(TileType.INDUSTRIAL_CENTER);
    expect(space.adjacency?.bonus).eq(undefined);
  });
});
