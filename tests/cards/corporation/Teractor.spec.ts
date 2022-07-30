import {expect} from 'chai';
import {Birds} from '../../../src/cards/base/Birds';
import {Cartel} from '../../../src/cards/base/Cartel';
import {LunaGovernor} from '../../../src/cards/colonies/LunaGovernor';
import {Teractor} from '../../../src/cards/corporation/Teractor';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Teractor', function() {
  let card: Teractor;
  let player: Player;

  beforeEach(function() {
    card = new Teractor();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);

    const action = card.play();
    expect(action).is.undefined;
  });


  it('Should play', function() {
    expect(card.getCardDiscount(player, new Cartel())).to.eq(3);
    expect(card.getCardDiscount(player, new Birds())).to.eq(0);
  });

  it('Discounts Luna Governor correctly', function() {
    expect(card.getCardDiscount(player, new LunaGovernor())).to.eq(6);
  });
});
