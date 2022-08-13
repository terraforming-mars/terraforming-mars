import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {WarOnEarth} from '../../src/server/turmoil/globalEvents/WarOnEarth';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('WarOnEarth', function() {
  it('resolve play', function() {
    const card = new WarOnEarth();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    player.setTerraformRating(15);
    player2.setTerraformRating(15);

    card.resolve(game, turmoil);
    expect(player.getTerraformRating()).to.eq(11);
    expect(player2.getTerraformRating()).to.eq(14);
  });
});
