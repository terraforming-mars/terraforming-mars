import {expect} from 'chai';
import {AgricolaInc} from '../../../src/cards/community/AgricolaInc';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {SolarWindPower} from '../../../src/cards/SolarWindPower';
import {Research} from '../../../src/cards/Research';
import {CoronaExtractor} from '../../../src/cards/colonies/CoronaExtractor';

describe('AgricolaInc', function() {
  let card : AgricolaInc; let player : Player; let game : Game;

  beforeEach(function() {
    card = new AgricolaInc();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);

    card.play(player);
    player.corporationCard = card;
  });

  it('Starts with correct production', function() {
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });

  it('Scores endgame VP correctly', function() {
    expect(card.getVictoryPoints(player, game)).to.eq(-18);

    player.playedCards.push(new SolarWindPower(), new Research(), new CoronaExtractor());
    expect(card.getVictoryPoints(player, game)).to.eq(-11);
  });
});
