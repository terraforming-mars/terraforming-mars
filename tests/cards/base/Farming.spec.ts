import {expect} from 'chai';
import {Farming} from '../../../src/cards/base/Farming';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Farming', function() {
  let card : Farming; let player : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new Farming();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = 4;
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    expect(player.plants).to.eq(2);

    expect(card.getVictoryPoints()).to.eq(2);
  });
});
