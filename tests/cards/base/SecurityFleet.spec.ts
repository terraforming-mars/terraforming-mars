import {expect} from 'chai';
import {SecurityFleet} from '../../../src/server/cards/base/SecurityFleet';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('SecurityFleet', function() {
  let card: SecurityFleet;
  let player: Player;

  beforeEach(function() {
    card = new SecurityFleet();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not act if no titanium', function() {
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
