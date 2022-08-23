import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {VolcanicEruptions} from '../../src/server/turmoil/globalEvents/VolcanicEruptions';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('VolcanicEruptions', function() {
  it('resolve play', function() {
    const card = new VolcanicEruptions();
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

    card.resolve(game, turmoil);
    expect(player.production.heat).to.eq(0);
    expect(player2.production.heat).to.eq(3);
    expect(game.getTemperature()).to.eq(-26);
  });
});
