import {expect} from 'chai';
import {Insects} from '../../../src/cards/base/Insects';
import {Trees} from '../../../src/cards/base/Trees';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Insects', function() {
  let card : Insects; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Insects();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 6;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(0);

    player.playedCards.push(new Trees());
    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
