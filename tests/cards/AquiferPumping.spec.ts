import {expect} from 'chai';
import {AquiferPumping} from '../../src/cards/AquiferPumping';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {maxOutOceans} from '../TestingUtils';

describe('AquiferPumping', function() {
  let card : AquiferPumping; let player : Player; let game : Game;

  beforeEach(function() {
    card = new AquiferPumping();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Should play', function() {
    expect(card.play()).is.undefined;
  });

  it('Should act', function() {
    player.megaCredits = 8;
    const action = card.action(player, game);
    expect(action).is.undefined;
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
  });

  it('Cannot act if not enough to pay', function() {
    expect(card.canAct(player, game)).is.not.true;
  });

  it('Can act if can pay even after oceans are maxed', function() {
    maxOutOceans(player, game);
    player.megaCredits = 8;

    expect(card.canAct(player, game)).is.true;
  });
});
