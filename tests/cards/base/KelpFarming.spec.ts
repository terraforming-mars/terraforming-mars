import {expect} from 'chai';
import {KelpFarming} from '../../../src/server/cards/base/KelpFarming';
import {TestPlayer} from '../../TestPlayer';
import {maxOutOceans} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('KelpFarming', () => {
  let card: KelpFarming;
  let player: TestPlayer;

  beforeEach(() => {
    card = new KelpFarming();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    maxOutOceans(player, 6);
    expect(card.canPlay(player)).is.true;

    const plantsCount = player.plants;
    card.play(player);
    expect(player.production.megacredits).to.eq(2);
    expect(player.production.plants).to.eq(3);
    expect(player.plants).to.eq(plantsCount + 2);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
