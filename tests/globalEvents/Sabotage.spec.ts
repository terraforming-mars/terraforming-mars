import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Resources} from '../../src/common/Resources';
import {Sabotage} from '../../src/turmoil/globalEvents/Sabotage';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('Sabotage', function() {
  it('resolve play', function() {
    const card = new Sabotage();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    player.addProduction(Resources.ENERGY, 1);
    player2.addProduction(Resources.STEEL, 3);

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.STEEL)).to.eq(0);
    expect(player2.getResource(Resources.STEEL)).to.eq(3);
    expect(player2.getProduction(Resources.STEEL)).to.eq(2);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
  });
});
