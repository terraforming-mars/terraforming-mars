import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {SolarWindPower} from '../../../src/server/cards/base/SolarWindPower';
import {CoronaExtractor} from '../../../src/server/cards/colonies/CoronaExtractor';
import {AgricolaInc} from '../../../src/server/cards/community/AgricolaInc';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {VenusianAnimals} from '../../../src/server/cards/venusNext/VenusianAnimals';

describe('AgricolaInc', function() {
  let card: AgricolaInc;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AgricolaInc();
    [/* skipped */, player] = testGame(2);

    card.play(player);
    player.setCorporationForTest(card);
  });

  it('Starts with correct production', function() {
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 1, plants: 1, heat: 1}));
    expect(player.production.megacredits).to.eq(1);
    expect(player.production.plants).to.eq(1);
  });

  it('Scores endgame VP correctly', function() {
    expect(card.getVictoryPoints(player)).to.eq(-18);

    player.playedCards.push(new SolarWindPower(), new Research(), new CoronaExtractor());
    expect(card.getVictoryPoints(player)).to.eq(-11);
  });

  it('Scores endgame VP correctly, with Venus', function() {
    [/* skipped */, player] = testGame(2, {venusNextExtension: true});
    card.play(player);
    player.setCorporationForTest(card);

    expect(card.getVictoryPoints(player)).to.eq(-20);

    // Science, Space, Power
    player.playedCards.push(new SolarWindPower());
    expect(card.getVictoryPoints(player)).to.eq(-14);
    // Science, Science
    player.playedCards.push(new Research());
    expect(card.getVictoryPoints(player)).to.eq(-13);
    // Space, Power
    player.playedCards.push(new CoronaExtractor());
    expect(card.getVictoryPoints(player)).to.eq(-13);
    // Venus, Animal, Science
    player.playedCards.push(new VenusianAnimals());
    expect(card.getVictoryPoints(player)).to.eq(-9);
  });
});
