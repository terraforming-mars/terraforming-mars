import {expect} from 'chai';
import {Europa} from '../../src/colonies/Europa';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {PlaceOceanTile} from '../../src/deferredActions/PlaceOceanTile';

describe('Europa', function() {
  let europa: Europa; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    europa = new Europa();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(europa);
  });

  it('Should build', function() {
    europa.onColonyPlaced(player, game);
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
    europa.onColonyPlaced(player, game);
    game.deferredActions.shift();

    europa.trade(player2, game);
    game.deferredActions.runAll(() => {});

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.megaCredits).to.eq(1);
    expect(player2.megaCredits).to.eq(0);
  });
});
