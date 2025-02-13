import {expect} from 'chai';
import {Luna} from '../../src/server/colonies/Luna';
import {Triton} from '../../src/server/colonies/Triton';
import {MicrogravityHealthProblems} from '../../src/server/turmoil/globalEvents/MicrogravityHealthProblems';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('MicrogravityHealthProblems', () => {
  it('resolve play', () => {
    const card = new MicrogravityHealthProblems();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    const colony1 = new Luna();
    const colony2 = new Triton();
    colony1.colonies.push(player.id);
    colony2.colonies.push(player.id);
    colony1.colonies.push(player2.id);
    colony2.colonies.push(player2.id);
    game.colonies.push(colony1);
    game.colonies.push(colony2);
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    player.megaCredits = 20;
    player2.megaCredits = 20;
    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(14);
    expect(player2.megaCredits).to.eq(20);
  });
});
