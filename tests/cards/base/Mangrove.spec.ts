import {expect} from 'chai';
import {Mangrove} from '../../../src/cards/base/Mangrove';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';

describe('Mangrove', function() {
  let card : Mangrove; let player : TestPlayer;

  beforeEach(function() {
    card = new Mangrove();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.not.undefined;

    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.GREENERY);
    expect(action.availableSpaces[0].player).to.eq(player);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
