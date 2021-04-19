import {expect} from 'chai';
import {Virus} from '../../src/cards/base/Virus';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {CelebrityLeaders} from '../../src/turmoil/globalEvents/CelebrityLeaders';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('CelebrityLeaders', function() {
  it('resolve play', function() {
    const card = new CelebrityLeaders();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    player.playedCards.push(new Virus());
    player2.playedCards.push(new Virus());
    player2.playedCards.push(new Virus());

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    player.megaCredits = 10;
    player2.megaCredits = 10;

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(12);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(20);
  });
});
