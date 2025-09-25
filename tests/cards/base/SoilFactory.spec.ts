import {expect} from 'chai';
import {SoilFactory} from '../../../src/server/cards/base/SoilFactory';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';

describe('SoilFactory', () => {
  let card: SoilFactory;
  let player: TestPlayer;

  beforeEach(() => {
    card = new SoilFactory();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.plants).to.eq(1);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
