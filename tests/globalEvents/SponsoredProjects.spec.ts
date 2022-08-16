import {expect} from 'chai';
import {Ants} from '../../src/server/cards/base/Ants';
import {Fish} from '../../src/server/cards/base/Fish';
import {SecurityFleet} from '../../src/server/cards/base/SecurityFleet';
import {Game} from '../../src/server/Game';
import {SponsoredProjects} from '../../src/server/turmoil/globalEvents/SponsoredProjects';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('SponsoredProjects', function() {
  it('resolve play', function() {
    const card = new SponsoredProjects();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
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
