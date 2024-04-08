import {expect} from 'chai';
import {SecurityFleet} from '../../../src/server/cards/base/SecurityFleet';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';

describe('SecurityFleet', function() {
  let card: SecurityFleet;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SecurityFleet();
    [/* game */, player] = testGame(1);
  });

  it('Can not act if no titanium', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    player.titanium = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    runAllActions(player.game);
    expect(player.titanium).to.eq(0);
    expect(card.resourceCount).to.eq(1);
  });
});
