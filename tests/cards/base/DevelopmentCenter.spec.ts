import {expect} from 'chai';
import {DevelopmentCenter} from '../../../src/server/cards/base/DevelopmentCenter';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('DevelopmentCenter', function() {
  let card: DevelopmentCenter;
  let player: Player;

  beforeEach(function() {
    card = new DevelopmentCenter();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not act', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});

