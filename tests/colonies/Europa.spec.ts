import {expect} from 'chai';
import {Europa} from '../../src/colonies/Europa';
import {PlaceOceanTile} from '../../src/deferredActions/PlaceOceanTile';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {Resources} from '../../src/Resources';
import {TestPlayers} from '../TestingUtils';

describe('Europa', function() {
  let europa: Europa; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    europa = new Europa();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(europa);
  });

  it('Should build', function() {
    europa.addColony(player, game);
    expect(game.deferredActions).has.lengthOf(1);
    const action = game.deferredActions.shift()!;
    expect(action).to.be.an.instanceof(PlaceOceanTile);
    expect(action.player).to.eq(player);
  });

  it('Should trade', function() {
    europa.trade(player, game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
  });

  it('Should give trade bonus', function() {
    europa.addColony(player, game);
    game.deferredActions.shift();

    europa.trade(player2, game);
    game.deferredActions.runAll(() => {});

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.megaCredits).to.eq(1);
    expect(player2.megaCredits).to.eq(0);
  });
});
