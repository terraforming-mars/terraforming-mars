import {expect} from 'chai';
import {UtopiaInvest} from '../../../src/server/cards/turmoil/UtopiaInvest';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('UtopiaInvest', function() {
  it('Should play', function() {
    const card = new UtopiaInvest();
    const [/* game */, player] = testGame(2, {turmoilExtension: true});
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.production.titanium).to.eq(1);
    expect(player.production.steel).to.eq(1);
    const action = cast(card.action(player), OrOptions);
    action.options[2].cb();
    expect(player.titanium).to.eq(4);
    expect(player.production.titanium).to.eq(0);
  });
});
