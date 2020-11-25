import {expect} from 'chai';
import {Diversity} from '../../src/turmoil/globalEvents/Diversity';
import {Player} from '../../src/Player';
import {Color} from '../../src/Color';
import {Resources} from '../../src/Resources';
import {Game} from '../../src/Game';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {AdvancedEcosystems} from '../../src/cards/AdvancedEcosystems';
import {SolarWindPower} from '../../src/cards/SolarWindPower';
import {EarlySettlement} from '../../src/cards/prelude/EarlySettlement';

describe('Diversity', function() {
  it('resolve play', function() {
    const card = new Diversity();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player);
    const turmoil = new Turmoil(game, false);
    turmoil.initGlobalEvent(game);
    player2.playedCards.push(new AdvancedEcosystems());
    player2.playedCards.push(new EarlySettlement());
    player2.playedCards.push(new SolarWindPower());
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(0);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(10);
  });
});
