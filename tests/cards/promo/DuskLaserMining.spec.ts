import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {DuskLaserMining} from '../../../src/server/cards/promo/DuskLaserMining';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';

describe('DuskLaserMining', () => {
  let card: DuskLaserMining;
  let player: TestPlayer;

  beforeEach(() => {
    card = new DuskLaserMining();
    [/* game */, player] = testGame(1);
  });

  it('Can not play if not enough science tags', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if no energy production', () => {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.playedCards.push(new Research());
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.titanium).to.eq(1);
    expect(player.titanium).to.eq(4);
  });
});
