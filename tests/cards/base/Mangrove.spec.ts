import {expect} from 'chai';
import {Mangrove} from '../../../src/server/cards/base/Mangrove';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('Mangrove', function() {
  let card: Mangrove;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Mangrove();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.spaces[0]);
    expect(action.spaces[0].tile && action.spaces[0].tile.tileType).to.eq(TileType.GREENERY);
    expect(action.spaces[0].player).to.eq(player);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
