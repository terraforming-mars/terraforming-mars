import {expect} from 'chai';
import {Sponsors} from '../../src/server/cards/base/Sponsors';
import {HomeworldSupport} from '../../src/server/turmoil/globalEvents/HomeworldSupport';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('HomeworldSupport', () => {
  it('resolve play', () => {
    const card = new HomeworldSupport();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.playedCards.push(new Sponsors());
    player2.playedCards.push(new Sponsors());
    player2.playedCards.push(new Sponsors());

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(10);
  });
});
