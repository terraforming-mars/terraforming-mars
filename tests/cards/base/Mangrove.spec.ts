import {expect} from 'chai';
import {Mangrove} from '../../../src/server/cards/base/Mangrove';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('Mangrove', function() {
  let card: Mangrove;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Mangrove();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.GREENERY);
    expect(action.availableSpaces[0].player).to.eq(player);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
