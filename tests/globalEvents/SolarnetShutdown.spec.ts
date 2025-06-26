import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../src/server/cards/base/ColonizerTrainingCamp';
import {InventorsGuild} from '../../src/server/cards/base/InventorsGuild';
import {SolarnetShutdown} from '../../src/server/turmoil/globalEvents/SolarnetShutdown';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';
import {Tardigrades} from '../../src/server/cards/base/Tardigrades';
import {AICentral} from '../../src/server/cards/base/AICentral';

describe('SolarnetShutdown', () => {
  it('resolve play', () => {
    const card = new SolarnetShutdown();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.playedCards.push(new InventorsGuild(), new ColonizerTrainingCamp());
    player2.playedCards.push(new InventorsGuild(), new Tardigrades(), new AICentral());
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
