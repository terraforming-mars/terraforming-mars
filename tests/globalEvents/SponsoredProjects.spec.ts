import {expect} from 'chai';
import {Ants} from '../../src/server/cards/base/Ants';
import {Fish} from '../../src/server/cards/base/Fish';
import {SecurityFleet} from '../../src/server/cards/base/SecurityFleet';
import {SponsoredProjects} from '../../src/server/turmoil/globalEvents/SponsoredProjects';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('SponsoredProjects', function() {
  it('resolve play', function() {
    const card = new SponsoredProjects();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.playedCards.push(new Ants());
    if (player.playedCards[0].resourceCount !== undefined) {
      player.playedCards[0].resourceCount++;
    }
    player2.playedCards.push(new SecurityFleet());
    if (player2.playedCards[0].resourceCount !== undefined) {
      player2.playedCards[0].resourceCount++;
    }
    player2.playedCards.push(new Fish());

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.playedCards[0].resourceCount).to.eq(2);
    expect(player2.playedCards[0].resourceCount).to.eq(2);
    expect(player2.playedCards[1].resourceCount).to.eq(0);
    expect(player2.cardsInHand).has.lengthOf(3);
  });
});
