import {expect} from 'chai';
import {Resource} from '../../src/common/Resource';
import {Sabotage} from '../../src/server/turmoil/globalEvents/Sabotage';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('Sabotage', function() {
  it('resolve play', function() {
    const card = new Sabotage();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
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
