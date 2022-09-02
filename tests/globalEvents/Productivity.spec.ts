import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
import {Productivity} from '../../src/server/turmoil/globalEvents/Productivity';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('Productivity', function() {
  it('resolve play', function() {
    const card = new Productivity();
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

    player.production.add(Resources.STEEL, 3);
    player2.production.add(Resources.STEEL, 3);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.STEEL)).to.eq(3);
    expect(player2.getResource(Resources.STEEL)).to.eq(6);
  });
});
