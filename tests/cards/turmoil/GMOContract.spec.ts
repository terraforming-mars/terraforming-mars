import {expect} from 'chai';
import {GMOContract} from '../../../src/server/cards/turmoil/GMOContract';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGameOptions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('GMOContract', function() {
  it('Should play', function() {
    const card = new GMOContract();
    const [game, player] = testGame(1, testGameOptions({turmoilExtension: true}));
    const turmoil = game.turmoil!;

    turmoil.rulingParty = turmoil.getPartyByName(PartyName.REDS);
    expect(player.simpleCanPlay(card)).is.not.true;
    const greens = turmoil.getPartyByName(PartyName.GREENS);
    greens.delegates.add(player.id, 2);
    expect(player.simpleCanPlay(card)).is.true;
    card.play(player);
    card.onCardPlayed(player, card);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(2);
  });
});
