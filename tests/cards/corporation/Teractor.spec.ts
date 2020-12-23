import {expect} from 'chai';
import {Birds} from '../../../src/cards/base/Birds';
import {Cartel} from '../../../src/cards/base/Cartel';
import {LunaGovernor} from '../../../src/cards/colonies/LunaGovernor';
import {Teractor} from '../../../src/cards/corporation/Teractor';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('Teractor', function() {
  let card : Teractor; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Teractor();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);

    const action = card.play();
    expect(action).is.undefined;
  });


  it('Should play', function() {
    expect(card.getCardDiscount(player, game, new Cartel())).to.eq(3);
    expect(card.getCardDiscount(player, game, new Birds())).to.eq(0);
  });

  it('Discounts Luna Governor correctly', function() {
    expect(card.getCardDiscount(player, game, new LunaGovernor())).to.eq(6);
  });
});
