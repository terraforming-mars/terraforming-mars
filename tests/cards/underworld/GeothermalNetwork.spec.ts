import {expect} from 'chai';
import {GeothermalNetwork} from '../../../src/server/cards/underworld/GeothermalNetwork';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('GeothermalNetwork', () => {
  it('canPlay', () => {
    const card = new GeothermalNetwork();
    const [/* game */, player] = testGame(2);

    expect(card.canPlay(player)).is.false;
    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
    expect(card.canPlay(player)).is.false;
    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
    expect(card.canPlay(player)).is.false;
    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new GeothermalNetwork();
    const [/* game */, player] = testGame(2);

    cast(card.play(player), undefined);

    expect(player.production.heat).eq(3);
  });
});
