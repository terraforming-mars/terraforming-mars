import {expect} from 'chai';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Cartel} from '../../../src/server/cards/base/Cartel';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {Teractor} from '../../../src/server/cards/corporation/Teractor';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Teractor', function() {
  let card: Teractor;
  let player: Player;

  beforeEach(function() {
    card = new Teractor();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);

    const action = card.play(player);
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
