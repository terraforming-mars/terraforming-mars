import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../src/server/cards/base/ColonizerTrainingCamp';
import {InventorsGuild} from '../../src/server/cards/base/InventorsGuild';
import {Game} from '../../src/server/Game';
import {SolarnetShutdown} from '../../src/server/turmoil/globalEvents/SolarnetShutdown';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('SolarnetShutdown', function() {
  it('resolve play', function() {
    const card = new SolarnetShutdown();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    player.playedCards.push(new InventorsGuild());
    player.playedCards.push(new ColonizerTrainingCamp());
    player2.playedCards.push(new InventorsGuild(), new InventorsGuild(), new InventorsGuild());
    player.megaCredits = 10;
    player2.megaCredits = 10;

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(7);
    expect(player2.megaCredits).to.eq(10);
  });
});
