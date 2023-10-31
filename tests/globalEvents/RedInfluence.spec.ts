import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {RedInfluence} from '../../src/server/turmoil/globalEvents/RedInfluence';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('RedInfluence', function() {
  it('resolve play', function() {
    const card = new RedInfluence();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    player.setTerraformRating(23);
    player.megaCredits = 10;
    player2.megaCredits = 10;

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(4);
    expect(player2.megaCredits).to.eq(4);
    expect(player.production.megacredits).to.eq(0);
    expect(player2.production.megacredits).to.eq(3);
  });

  it('Max 5', function() {
    const card = new RedInfluence();
    const player = TestPlayer.BLACK.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
    const turmoil = Turmoil.newInstance(game);

    player.setTerraformRating(59);
    player.megaCredits = 20;

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(5);
  });
});
