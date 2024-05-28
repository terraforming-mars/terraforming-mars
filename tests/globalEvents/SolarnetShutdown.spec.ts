import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../src/server/cards/base/ColonizerTrainingCamp';
import {InventorsGuild} from '../../src/server/cards/base/InventorsGuild';
import {SolarnetShutdown} from '../../src/server/turmoil/globalEvents/SolarnetShutdown';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('SolarnetShutdown', function() {
  it('resolve play', function() {
    const card = new SolarnetShutdown();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
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
