import {expect} from 'chai';
import {Europa} from '../../src/server/colonies/Europa';
import {PlaceOceanTile} from '../../src/server/deferredActions/PlaceOceanTile';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';

describe('Europa', function() {
  let europa: Europa;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    europa = new Europa();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(europa);
  });

  it('Should build', function() {
    europa.addColony(player);
    expect(game.deferredActions).has.lengthOf(1);
    const action = game.deferredActions.pop()!;
    expect(action).to.be.an.instanceof(PlaceOceanTile);
    expect(action.player).to.eq(player);
  });

  it('Should trade', function() {
    europa.trade(player);
    expect(player.production.megacredits).to.eq(1);
    expect(player2.production.megacredits).to.eq(0);
  });

  it('Should give trade bonus', function() {
    europa.addColony(player);
    game.deferredActions.pop();

    europa.trade(player2);
    runAllActions(game);

    expect(player.production.megacredits).to.eq(0);
    expect(player2.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(1);
    expect(player2.megaCredits).to.eq(0);
  });
});
