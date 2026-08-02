import {expect} from 'chai';
import {LeadershipSummit} from '../../../src/server/cards/community/LeadershipSummit';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestingUtils';

describe('LeadershipSummit', () => {
  it('resolve play', () => {
    const card = new LeadershipSummit();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;

    turmoil.dominantParty = turmoil.getPartyByName(PartyName.REDS);
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player);

    card.resolve(game);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player2.cardsInHand).has.lengthOf(3);
  });

  it('party leaders are capped at 5, then influence is added', () => {
    const card = new LeadershipSummit();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;

    // There are 6 parties, so leading all of them exceeds the cap.
    expect(turmoil.parties).has.lengthOf(6);
    turmoil.parties.forEach((party) => party.partyLeader = player);

    turmoil.dominantParty = turmoil.getPartyByName(PartyName.REDS);
    turmoil.addInfluenceBonus(player, 2);
    expect(turmoil.getInfluence(player)).eq(3);

    card.resolve(game);

    // min(6, 5) + 3. Not 6 + 3, and not min(6 + 3, 5).
    expect(player.cardsInHand).has.lengthOf(8);
    expect(player2.cardsInHand).has.lengthOf(0);
  });
});
