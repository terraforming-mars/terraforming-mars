import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Resources} from '../../src/common/Resources';
import {Productivity} from '../../src/turmoil/globalEvents/Productivity';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('Productivity', function() {
  it('resolve play', function() {
    const card = new Productivity();
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

    player.addProduction(Resources.STEEL, 3);
    player2.addProduction(Resources.STEEL, 3);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.STEEL)).to.eq(3);
    expect(player2.getResource(Resources.STEEL)).to.eq(6);
  });
});
