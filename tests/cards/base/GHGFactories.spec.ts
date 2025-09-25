import {expect} from 'chai';
import {GHGFactories} from '../../../src/server/cards/base/GHGFactories';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';

describe('GHGFactories', () => {
  let card: GHGFactories;
  let player: TestPlayer;

  beforeEach(() => {
    card = new GHGFactories();
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
    expect(player.production.heat).to.eq(4);
  });
});
