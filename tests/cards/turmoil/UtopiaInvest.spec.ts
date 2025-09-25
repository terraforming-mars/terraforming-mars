import {expect} from 'chai';
import {UtopiaInvest} from '../../../src/server/cards/turmoil/UtopiaInvest';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('UtopiaInvest', () => {
  it('Should play', () => {
    const card = new UtopiaInvest();
    const [/* game */, player] = testGame(2, {turmoilExtension: true});
    cast(card.play(player), undefined);

    expect(player.production.titanium).to.eq(1);
    expect(player.production.steel).to.eq(1);

    const action = cast(card.action(player), OrOptions);
    action.options[2].cb();

    expect(player.titanium).to.eq(4);
    expect(player.production.titanium).to.eq(0);
  });
});
