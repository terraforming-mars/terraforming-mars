import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {GenerousFunding} from '../../src/turmoil/globalEvents/GenerousFunding';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('GenerousFunding', function() {
  it('resolve play', function() {
    const card = new GenerousFunding();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    player.megaCredits = 10;
    player2.megaCredits = 10;
    player.setTerraformRating(25);
    player2.setTerraformRating(50);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(14);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(26);
  });

  it('no negative mc give out if TR lower than 15', function() {
    const card = new GenerousFunding();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    player.megaCredits = 10;
    player2.megaCredits = 10;
    player.setTerraformRating(12);
    player2.setTerraformRating(50);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(10);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(26);
  });
});
