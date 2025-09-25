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

    card.resolve(game, turmoil);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player2.cardsInHand).has.lengthOf(3);
  });
});
