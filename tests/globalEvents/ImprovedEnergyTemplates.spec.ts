import {expect} from 'chai';
import {SolarWindPower} from '../../src/server/cards/base/SolarWindPower';
import {Game} from '../../src/server/Game';
import {ImprovedEnergyTemplates} from '../../src/server/turmoil/globalEvents/ImprovedEnergyTemplates';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('ImprovedEnergyTemplates', function() {
  it('resolve play', function() {
    const card = new ImprovedEnergyTemplates();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);
    turmoil.initGlobalEvent(game);
    player.playedCards.push(new SolarWindPower());
    player2.playedCards.push(new SolarWindPower());
    player2.playedCards.push(new SolarWindPower());
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    card.resolve(game, turmoil);
    expect(player.production.energy).to.eq(0);
    expect(player2.production.energy).to.eq(2);
  });
});
