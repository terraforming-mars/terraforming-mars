import {expect} from 'chai';
import {AdvancedEcosystems} from '../../src/server/cards/base/AdvancedEcosystems';
import {SolarWindPower} from '../../src/server/cards/base/SolarWindPower';
import {EarlySettlement} from '../../src/server/cards/prelude/EarlySettlement';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
import {Diversity} from '../../src/server/turmoil/globalEvents/Diversity';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('Diversity', function() {
  it('resolve play', function() {
    const card = new Diversity();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
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
