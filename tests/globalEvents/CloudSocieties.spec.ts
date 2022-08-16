import {expect} from 'chai';
import {FloatingHabs} from '../../src/server/cards/venusNext/FloatingHabs';
import {Game} from '../../src/server/Game';
import {CloudSocieties} from '../../src/server/turmoil/globalEvents/CloudSocieties';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('CloudSocieties', function() {
  it('resolve play', function() {
    const card = new CloudSocieties();
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
    const turmoil = Turmoil.newInstance(game);
    player.playedCards.push(new FloatingHabs());
    turmoil.chairman = player.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player.id;
    turmoil.dominantParty.delegates.push(player.id);
    card.resolve(game, turmoil);
    game.deferredActions.runNext();
    expect(player.playedCards[0].resourceCount).to.eq(3);
  });
});
