import {expect} from 'chai';
import {SolarWindPower} from '../../src/cards/base/SolarWindPower';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {ImprovedEnergyTemplates} from '../../src/turmoil/globalEvents/ImprovedEnergyTemplates';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('ImprovedEnergyTemplates', function() {
  it('resolve play', function() {
    const card = new ImprovedEnergyTemplates();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
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
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player2.getProduction(Resources.ENERGY)).to.eq(2);
  });
});
