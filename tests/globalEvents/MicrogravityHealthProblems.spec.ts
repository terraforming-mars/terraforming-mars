import {expect} from 'chai';
import {Luna} from '../../src/server/colonies/Luna';
import {Triton} from '../../src/server/colonies/Triton';
import {Game} from '../../src/server/Game';
import {MicrogravityHealthProblems} from '../../src/server/turmoil/globalEvents/MicrogravityHealthProblems';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('MicrogravityHealthProblems', function() {
  it('resolve play', function() {
    const card = new MicrogravityHealthProblems();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);
    const colony1 = new Luna();
    const colony2 = new Triton();
    colony1.colonies.push(player.id);
    colony2.colonies.push(player.id);
    colony1.colonies.push(player2.id);
    colony2.colonies.push(player2.id);
    game.colonies.push(colony1);
    game.colonies.push(colony2);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    player.megaCredits = 20;
    player2.megaCredits = 20;
    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(14);
    expect(player2.megaCredits).to.eq(20);
  });
});
