import {expect} from 'chai';
import {MethaneFromTitan} from '../../src/server/cards/base/MethaneFromTitan';
import {Game} from '../../src/server/Game';
import {Resource} from '../../src/common/Resource';
import {MinersOnStrike} from '../../src/server/turmoil/globalEvents/MinersOnStrike';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('MinersOnStrike', function() {
  it('resolve play', function() {
    const card = new MinersOnStrike();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);
    turmoil.initGlobalEvent(game);
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
