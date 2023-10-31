import {expect} from 'chai';
import {Virus} from '../../src/server/cards/base/Virus';
import {Game} from '../../src/server/Game';
import {CelebrityLeaders} from '../../src/server/turmoil/globalEvents/CelebrityLeaders';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('CelebrityLeaders', function() {
  it('resolve play', function() {
    const card = new CelebrityLeaders();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new Virus());
    player2.playedCards.push(new Virus());
    player2.playedCards.push(new Virus());

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    player.megaCredits = 10;
    player2.megaCredits = 10;

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(12);
    expect(player2.megaCredits).to.eq(20);
  });
});
