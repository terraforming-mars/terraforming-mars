import {expect} from 'chai';
import {Ants} from '../../src/server/cards/base/Ants';
import {SecurityFleet} from '../../src/server/cards/base/SecurityFleet';
import {ScientificCommunity} from '../../src/server/turmoil/globalEvents/ScientificCommunity';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('ScientificCommunity', () => {
  it('resolve play', () => {
    const card = new ScientificCommunity();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.cardsInHand.push(new Ants());
    player2.cardsInHand.push(new SecurityFleet(), new Ants());

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(1);
    expect(player2.megaCredits).to.eq(5);
  });
});
