import {expect} from 'chai';
import {SponsoredMohole} from '../../../src/server/cards/turmoil/SponsoredMohole';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';

describe('SponsoredMohole', () => {
  it('Should play', () => {
    const card = new SponsoredMohole();
    const [game, player] = testGame(1, {turmoilExtension: true});
    expect(card.canPlay(player)).is.not.true;

    const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS);
    kelvinists.delegates.add(player, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.heat).to.eq(2);
  });
});
