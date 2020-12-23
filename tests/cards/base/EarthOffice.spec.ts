import {expect} from 'chai';
import {Birds} from '../../../src/cards/base/Birds';
import {EarthOffice} from '../../../src/cards/base/EarthOffice';
import {LunaGovernor} from '../../../src/cards/colonies/LunaGovernor';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('EarthOffice', function() {
  let card : EarthOffice; let player : Player; let game : Game;

  beforeEach(function() {
    card = new EarthOffice();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);

    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should play', function() {
    expect(card.getCardDiscount(player, game, card)).to.eq(3);
    expect(card.getCardDiscount(player, game, new Birds())).to.eq(0);
  });

  it('Discounts Luna Governor correctly', function() {
    expect(card.getCardDiscount(player, game, new LunaGovernor())).to.eq(6);
  });
});

