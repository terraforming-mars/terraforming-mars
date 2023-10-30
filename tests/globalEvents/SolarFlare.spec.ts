import {expect} from 'chai';
import {SpaceStation} from '../../src/server/cards/base/SpaceStation';
import {Game} from '../../src/server/Game';
import {SolarFlare} from '../../src/server/turmoil/globalEvents/SolarFlare';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('SolarFlare', function() {
  it('resolve play', function() {
    const card = new SolarFlare();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    player.playedCards.push(new SpaceStation());
    player2.playedCards.push(new SpaceStation(), new SpaceStation(), new SpaceStation());
    player.megaCredits = 10;
    player2.megaCredits = 10;

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(7);
    expect(player2.megaCredits).to.eq(10);
  });
});
