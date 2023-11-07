import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Resource} from '../../src/common/Resource';
import {SuccessfulOrganisms} from '../../src/server/turmoil/globalEvents/SuccessfulOrganisms';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('SuccessfulOrganisms', function() {
  it('resolve play', function() {
    const card = new SuccessfulOrganisms();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    player.production.add(Resource.PLANTS, 3);
    player2.production.add(Resource.PLANTS, 3);

    card.resolve(game, turmoil);
    expect(player.plants).to.eq(3);
    expect(player2.plants).to.eq(6);
  });
});
