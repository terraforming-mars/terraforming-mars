import {expect} from 'chai';
import {TychoMagnetics} from '../../../src/server/cards/promo/TychoMagnetics';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('TychoMagnetics', function() {
  let card: TychoMagnetics;
  let player: TestPlayer;

  beforeEach(function() {
    card = new TychoMagnetics();
    [/* skipped */, player] = testGame(1);
  });

  it('Can not act if no energy resources available', function() {
    expect(card.canAct(player)).is.not.true;
    player.energy = 1;
    expect(card.canAct(player)).is.true;
  });

  it('Should act', function() {
    player.energy = 5;
    expect(card.canAct(player)).is.true;

    const amount = cast(card.action(player), SelectAmount);

    amount.cb(3);
    expect(player.energy).to.eq(2);
  });
});
