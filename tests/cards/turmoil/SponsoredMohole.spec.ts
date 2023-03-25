import {expect} from 'chai';
import {SponsoredMohole} from '../../../src/server/cards/turmoil/SponsoredMohole';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGameOptions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('SponsoredMohole', function() {
  it('Should play', function() {
    const card = new SponsoredMohole();
    const [game, player] = testGame(1, testGameOptions({turmoilExtension: true}));
    expect(card.canPlay(player)).is.not.true;

    const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS);
    kelvinists.delegates.add(player.id, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.heat).to.eq(2);
  });
});
