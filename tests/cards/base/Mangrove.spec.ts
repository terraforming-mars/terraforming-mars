import {expect} from 'chai';
import {Mangrove} from '../../../src/server/cards/base/Mangrove';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {cast} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('Mangrove', function() {
  let card: Mangrove;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Mangrove();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    const action = cast(card.play(player), SelectSpace);
    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.GREENERY);
    expect(action.availableSpaces[0].player).to.eq(player);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
