import {expect} from 'chai';
import {SecurityFleet} from '../../../src/cards/base/SecurityFleet';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('SecurityFleet', function() {
  let card : SecurityFleet; let player : Player;

  beforeEach(function() {
    card = new SecurityFleet();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t act if no titanium', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    player.titanium = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.titanium).to.eq(0);
    expect(card.resourceCount).to.eq(1);
  });
});
