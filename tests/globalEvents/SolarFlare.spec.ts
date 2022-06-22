import {expect} from 'chai';
import {SpaceStation} from '../../src/cards/base/SpaceStation';
import {Game} from '../../src/Game';
import {Resources} from '../../src/common/Resources';
import {SolarFlare} from '../../src/turmoil/globalEvents/SolarFlare';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('SolarFlare', function() {
  it('resolve play', function() {
    const card = new SolarFlare();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    player.playedCards.push(new SpaceStation());
    player2.playedCards.push(new SpaceStation(), new SpaceStation(), new SpaceStation());
    player.megaCredits = 10;
    player2.megaCredits = 10;

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(7);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(10);
  });
});
