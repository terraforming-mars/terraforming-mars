import {expect} from 'chai';
import {Ants} from '../../src/cards/base/Ants';
import {Fish} from '../../src/cards/base/Fish';
import {SecurityFleet} from '../../src/cards/base/SecurityFleet';
import {Game} from '../../src/Game';
import {SponsoredProjects} from '../../src/turmoil/globalEvents/SponsoredProjects';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('SponsoredProjects', function() {
  it('resolve play', function() {
    const card = new SponsoredProjects();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    player.playedCards.push(new Ants());
    if (player.playedCards[0].resourceCount !== undefined) {
      player.playedCards[0].resourceCount++;
    }
    player2.playedCards.push(new SecurityFleet());
    if (player2.playedCards[0].resourceCount !== undefined) {
      player2.playedCards[0].resourceCount++;
    }
    player2.playedCards.push(new Fish());

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.playedCards[0].resourceCount).to.eq(2);
    expect(player2.playedCards[0].resourceCount).to.eq(2);
    expect(player2.playedCards[1].resourceCount).to.eq(0);
    expect(player2.cardsInHand).has.lengthOf(3);
  });
});
