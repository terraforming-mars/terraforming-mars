import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../src/server/cards/base/ColonizerTrainingCamp';
import {InventorsGuild} from '../../src/server/cards/base/InventorsGuild';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
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
