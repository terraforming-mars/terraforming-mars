import {expect} from 'chai';
import {StripMine} from '../../src/server/cards/base/StripMine';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
import {Pandemic} from '../../src/server/turmoil/globalEvents/Pandemic';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('Pandemic', function() {
  it('resolve play', function() {
    const card = new Pandemic();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);
    turmoil.initGlobalEvent(game);
    player.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    player.megaCredits = 10;
    player2.megaCredits = 10;
    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(7);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(10);
  });
});
