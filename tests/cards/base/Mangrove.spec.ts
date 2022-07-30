import {expect} from 'chai';
import {Mangrove} from '../../../src/cards/base/Mangrove';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';

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
    const action = card.play(player);
    expect(action).is.not.undefined;

    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.GREENERY);
    expect(action.availableSpaces[0].player).to.eq(player);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
