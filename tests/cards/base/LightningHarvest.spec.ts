import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {LightningHarvest} from '../../../src/server/cards/base/LightningHarvest';
import {TestPlayer} from '../../TestPlayer';

describe('LightningHarvest', () => {
  let card: LightningHarvest;
  let player: TestPlayer;

  beforeEach(() => {
    card = new LightningHarvest();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.tagsForTest = {science: 3};
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(1);
    expect(player.production.megacredits).to.eq(1);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
