import {expect} from 'chai';
import {AquiferPumping} from '../../../src/cards/base/AquiferPumping';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import * as utils from '../../TestingUtils';

describe('AquiferPumping', function() {
  let card : AquiferPumping; let player : Player; let game : Game;

  beforeEach(function() {
    card = new AquiferPumping();
    player = utils.TestPlayers.BLUE.newPlayer();
    const redPlayer = utils.TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    expect(card.play()).is.undefined;
  });

  it('Should act', function() {
    player.megaCredits = 8;
    const action = card.action(player);
    expect(action).is.undefined;
    utils.runNextAction(game);
    expect(player.megaCredits).to.eq(0);
  });

  it('Cannot act if not enough to pay', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Can act if can pay even after oceans are maxed', function() {
    utils.maxOutOceans(player, game);
    player.megaCredits = 8;

    expect(card.canAct(player)).is.true;
  });
});
