import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {SolarWindPower} from '../../../src/server/cards/base/SolarWindPower';
import {CoronaExtractor} from '../../../src/server/cards/colonies/CoronaExtractor';
import {AgricolaInc} from '../../../src/server/cards/community/AgricolaInc';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('AgricolaInc', function() {
  let card: AgricolaInc;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AgricolaInc();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);

    card.play(player);
    player.setCorporationForTest(card);
  });

  it('Starts with correct production', function() {
    expect(player.production.megacredits).to.eq(1);
    expect(player.production.plants).to.eq(1);
  });

  it('Scores endgame VP correctly', function() {
    expect(card.getVictoryPoints(player)).to.eq(-18);

    player.playedCards.push(new SolarWindPower(), new Research(), new CoronaExtractor());
    expect(card.getVictoryPoints(player)).to.eq(-11);
  });
});
