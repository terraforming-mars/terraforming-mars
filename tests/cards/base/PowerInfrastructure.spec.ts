import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {PowerInfrastructure} from '../../../src/server/cards/base/PowerInfrastructure';
import {TestPlayer} from '../../TestPlayer';

describe('PowerInfrastructure', () => {
  let card: PowerInfrastructure;
  let player: TestPlayer;

  beforeEach(() => {
    card = new PowerInfrastructure();
    [/* game */, player] = testGame(2);
  });

  it('Can not act', () => {
    card.play(player);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    const action = card.action(player);
    action.cb(1);

    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(1);
  });
});
