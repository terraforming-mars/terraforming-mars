import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Resource} from '../../src/common/Resource';
import {Sabotage} from '../../src/server/turmoil/globalEvents/Sabotage';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('Sabotage', function() {
  it('resolve play', function() {
    const card = new Sabotage();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    player.production.add(Resource.ENERGY, 1);
    player2.production.add(Resource.STEEL, 3);

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.steel).to.eq(0);
    expect(player2.steel).to.eq(3);
    expect(player2.production.steel).to.eq(2);
    expect(player.production.energy).to.eq(0);
  });
});
