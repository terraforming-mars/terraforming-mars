import {expect} from 'chai';
import {Heather} from '../../../src/cards/base/Heather';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Heather', function() {
  let card : Heather; let player : Player; let game: Game;

  beforeEach(function() {
    card = new Heather();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -14;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.plants).to.eq(1);
  });
});
