import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../src/cards/base/ColonizerTrainingCamp';
import {InventorsGuild} from '../../src/cards/base/InventorsGuild';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {SolarnetShutdown} from '../../src/turmoil/globalEvents/SolarnetShutdown';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('SolarnetShutdown', function() {
  it('resolve play', function() {
    const card = new SolarnetShutdown();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    player.playedCards.push(new InventorsGuild());
    player.playedCards.push(new ColonizerTrainingCamp());
    player2.playedCards.push(new InventorsGuild(), new InventorsGuild(), new InventorsGuild());
    player.megaCredits = 10;
    player2.megaCredits = 10;

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(7);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(10);
  });
});
