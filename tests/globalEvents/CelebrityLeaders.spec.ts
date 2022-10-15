import {expect} from 'chai';
import {Virus} from '../../src/server/cards/base/Virus';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
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

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    player.megaCredits = 10;
    player2.megaCredits = 10;

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(12);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(20);
  });
});
