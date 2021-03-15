import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {RedInfluence} from '../../src/turmoil/globalEvents/RedInfluence';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('RedInfluence', function() {
  it('resolve play', function() {
    const card = new RedInfluence();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    player.setTerraformRating(23);
    player.megaCredits = 10;
    player2.megaCredits = 10;

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(4);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(4);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });
});
