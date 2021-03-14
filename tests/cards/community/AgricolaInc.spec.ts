import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {SolarWindPower} from '../../../src/cards/base/SolarWindPower';
import {CoronaExtractor} from '../../../src/cards/colonies/CoronaExtractor';
import {AgricolaInc} from '../../../src/cards/community/AgricolaInc';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('AgricolaInc', function() {
  let card : AgricolaInc; let player : Player;

  beforeEach(function() {
    card = new AgricolaInc();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);

    card.play(player);
    player.corporationCard = card;
  });

  it('Starts with correct production', function() {
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });

  it('Scores endgame VP correctly', function() {
    expect(card.getVictoryPoints(player)).to.eq(-18);

    player.playedCards.push(new SolarWindPower(), new Research(), new CoronaExtractor());
    expect(card.getVictoryPoints(player)).to.eq(-11);
  });
});
