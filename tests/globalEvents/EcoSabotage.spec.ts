import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Resources} from '../../src/common/Resources';
import {EcoSabotage} from '../../src/turmoil/globalEvents/EcoSabotage';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('EcoSabotage', function() {
  it('resolve play', function() {
    const card = new EcoSabotage();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);
    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    player.plants = 5;
    player2.plants = 5;
    card.resolve(game, turmoil);
    expect(player.getResource(Resources.PLANTS)).to.eq(3);
    expect(player2.getResource(Resources.PLANTS)).to.eq(5);
  });
});
