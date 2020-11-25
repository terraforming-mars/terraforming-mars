import {expect} from 'chai';
import {SolarFlare} from '../../src/turmoil/globalEvents/SolarFlare';
import {Player} from '../../src/Player';
import {Color} from '../../src/Color';
import {Game} from '../../src/Game';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Resources} from '../../src/Resources';
import {SpaceStation} from '../../src/cards/SpaceStation';

describe('SolarFlare', function() {
  it('resolve play', function() {
    const card = new SolarFlare();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player);
    const turmoil = new Turmoil(game, false);

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
