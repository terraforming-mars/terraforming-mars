import {expect} from 'chai';
import {MethaneFromTitan} from '../../src/server/cards/base/MethaneFromTitan';
import {Resource} from '../../src/common/Resource';
import {MinersOnStrike} from '../../src/server/turmoil/globalEvents/MinersOnStrike';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('MinersOnStrike', () => {
  it('resolve play', () => {
    const card = new MinersOnStrike();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.stock.add(Resource.TITANIUM, 5);
    player2.stock.add(Resource.TITANIUM, 5);
    player.playedCards.push(new MethaneFromTitan());
    player2.playedCards.push(new MethaneFromTitan());
    player2.playedCards.push(new MethaneFromTitan());
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    card.resolve(game, turmoil);
    expect(player.titanium).to.eq(4);
    expect(player2.titanium).to.eq(5);
  });
});
