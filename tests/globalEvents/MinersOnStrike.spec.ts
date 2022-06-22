import {expect} from 'chai';
import {MethaneFromTitan} from '../../src/cards/base/MethaneFromTitan';
import {Game} from '../../src/Game';
import {Resources} from '../../src/common/Resources';
import {MinersOnStrike} from '../../src/turmoil/globalEvents/MinersOnStrike';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('MinersOnStrike', function() {
  it('resolve play', function() {
    const card = new MinersOnStrike();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);
    turmoil.initGlobalEvent(game);
    player.addResource(Resources.TITANIUM, 5);
    player2.addResource(Resources.TITANIUM, 5);
    player.playedCards.push(new MethaneFromTitan());
    player2.playedCards.push(new MethaneFromTitan());
    player2.playedCards.push(new MethaneFromTitan());
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    card.resolve(game, turmoil);
    expect(player.getResource(Resources.TITANIUM)).to.eq(4);
    expect(player2.getResource(Resources.TITANIUM)).to.eq(5);
  });
});
