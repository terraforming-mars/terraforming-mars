import {expect} from 'chai';
import {Resource} from '../../src/common/Resource';
import {SuccessfulOrganisms} from '../../src/server/turmoil/globalEvents/SuccessfulOrganisms';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('SuccessfulOrganisms', function() {
  it('resolve play', function() {
    const card = new SuccessfulOrganisms();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
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
