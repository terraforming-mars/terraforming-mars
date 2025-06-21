import {expect} from 'chai';
import {BiosphereSupport} from '../../../src/server/cards/prelude/BiosphereSupport';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';

describe('BiosphereSupport', () => {
  let card: BiosphereSupport;
  let player: TestPlayer;

  beforeEach(() => {
    card = new BiosphereSupport();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', () => {
    player.production.add(Resource.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.plants).to.eq(2);
    expect(player.production.megacredits).to.eq(-1);
  });
});
