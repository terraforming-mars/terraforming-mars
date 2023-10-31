import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {EcoSabotage} from '../../src/server/turmoil/globalEvents/EcoSabotage';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('EcoSabotage', function() {
  it('resolve play', function() {
    const card = new EcoSabotage();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);

    player.plants = 10;
    player2.plants = 10;

    expect(turmoil.getPlayerInfluence(player)).eq(0);
    expect(turmoil.getPlayerInfluence(player2)).eq(2);

    card.resolve(game, turmoil);

    expect(player.plants).to.eq(3);
    expect(player2.plants).to.eq(5);
  });
});
