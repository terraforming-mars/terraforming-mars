import {expect} from 'chai';
import {MethaneFromTitan} from '../../src/server/cards/base/MethaneFromTitan';
import {AsteroidMining} from '../../src/server/turmoil/globalEvents/AsteroidMining';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('AsteroidMining', function() {
  it('resolve play', function() {
    const card = new AsteroidMining();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    // turmoil.initGlobalEvent(game);
    player.playedCards.push(new MethaneFromTitan());
    player2.playedCards.push(new MethaneFromTitan());
    player2.playedCards.push(new MethaneFromTitan());

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.titanium).to.eq(1);
    expect(player2.titanium).to.eq(5);
  });
});
