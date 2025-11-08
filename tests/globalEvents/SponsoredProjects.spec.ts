import {expect} from 'chai';
import {Ants} from '../../src/server/cards/base/Ants';
import {Fish} from '../../src/server/cards/base/Fish';
import {SecurityFleet} from '../../src/server/cards/base/SecurityFleet';
import {SponsoredProjects} from '../../src/server/turmoil/globalEvents/SponsoredProjects';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('SponsoredProjects', () => {
  it('resolve play', () => {
    const card = new SponsoredProjects();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;

    const ants = new Ants();
    ants.resourceCount = 1;
    player.playedCards.push(ants);

    const securityFleet = new SecurityFleet();
    securityFleet.resourceCount = 1;
    player2.playedCards.push(securityFleet);

    const fish = new Fish();
    player2.playedCards.push(fish);

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(ants.resourceCount).to.eq(2);
    expect(securityFleet.resourceCount).to.eq(2);
    expect(fish.resourceCount).to.eq(0);
    expect(player2.cardsInHand).has.lengthOf(3);
  });
});
