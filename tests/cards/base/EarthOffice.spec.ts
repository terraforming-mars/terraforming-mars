import {expect} from 'chai';
import {Birds} from '../../../src/server/cards/base/Birds';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('EarthOffice', function() {
  let card: EarthOffice;
  let player: Player;

  beforeEach(function() {
    card = new EarthOffice();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);

    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should play', function() {
    expect(card.getCardDiscount(player, card)).to.eq(3);
    expect(card.getCardDiscount(player, new Birds())).to.eq(0);
  });

  it('Discounts Luna Governor correctly', function() {
    expect(card.getCardDiscount(player, new LunaGovernor())).to.eq(6);
  });
});

