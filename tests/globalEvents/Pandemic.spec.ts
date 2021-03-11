import {expect} from 'chai';
import {StripMine} from '../../src/cards/base/StripMine';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {Pandemic} from '../../src/turmoil/globalEvents/Pandemic';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('Pandemic', function() {
  it('resolve play', function() {
    const card = new Pandemic();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
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
