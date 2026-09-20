import {expect} from 'chai';
import {SterlingVents} from '../../../src/server/cards/promo/SterlingVents';
import {testGame} from '../../TestGame';
import {cast} from '../../../src/common/utils/utils';

describe('SterlingVents', () => {
  it('canPlay', () => {
    const card = new SterlingVents();
    const [/* game */, player] = testGame(2);

    player.production.override({heat: 1});
    expect(card.canPlay(player)).is.false;

    player.production.override({heat: 2});
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const card = new SterlingVents();
    const [/* game */, player] = testGame(2);

    player.production.override({heat: 2, energy: 0});

    cast(card.play(player), undefined);
    expect(player.production.heat).eq(0);
    expect(player.production.energy).eq(2);
  });
});
