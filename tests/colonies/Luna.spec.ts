import {expect} from 'chai';
import {Luna} from '../../src/colonies/Luna';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {Resources} from '../../src/Resources';
import {TestPlayers} from '../TestPlayers';

describe('Luna', function() {
  let luna: Luna; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    luna = new Luna();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(luna);
  });

  it('Should build', function() {
    luna.addColony(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
  });

  it('Should trade', function() {
    luna.trade(player);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(0);
  });

  it('Should give trade bonus', function() {
    luna.addColony(player);

    luna.trade(player2);
    game.deferredActions.runAll(() => {});

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(2);
  });
});
