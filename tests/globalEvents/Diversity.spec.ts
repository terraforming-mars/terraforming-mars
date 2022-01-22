import {expect} from 'chai';
import {AdvancedEcosystems} from '../../src/cards/base/AdvancedEcosystems';
import {SolarWindPower} from '../../src/cards/base/SolarWindPower';
import {EarlySettlement} from '../../src/cards/prelude/EarlySettlement';
import {Game} from '../../src/Game';
import {Resources} from '../../src/common/Resources';
import {Diversity} from '../../src/turmoil/globalEvents/Diversity';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('Diversity', function() {
  it('resolve play', function() {
    const card = new Diversity();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);
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
