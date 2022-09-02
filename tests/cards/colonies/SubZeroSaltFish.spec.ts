import {expect} from 'chai';
import {SubZeroSaltFish} from '../../../src/server/cards/colonies/SubZeroSaltFish';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('SubZeroSaltFish', function() {
  let card: SubZeroSaltFish;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    card = new SubZeroSaltFish();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Can not play if no one has plant production', function() {
    (game as any).temperature = 2;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can not play if temperature requirement not met', function() {
    player2.production.add(Resources.PLANTS, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = 2;
    player2.production.add(Resources.PLANTS, 1);
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
