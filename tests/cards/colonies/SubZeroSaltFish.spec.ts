import {expect} from 'chai';
import {SubZeroSaltFish} from '../../../src/cards/colonies/SubZeroSaltFish';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('SubZeroSaltFish', function() {
  let card : SubZeroSaltFish; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new SubZeroSaltFish();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play if no one has plant production', function() {
    (game as any).temperature = 2;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can\'t play if temperature requirement not met', function() {
    player2.addProduction(Resources.PLANTS, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = 2;
    player2.addProduction(Resources.PLANTS, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints()).to.eq(2);
  });

  it('Should act', function() {
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });
});
