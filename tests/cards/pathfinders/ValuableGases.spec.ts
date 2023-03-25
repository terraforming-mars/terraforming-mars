import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {ValuableGases} from '../../../src/server/cards/pathfinders/ValuableGases';
import {TestPlayer} from '../../TestPlayer';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {AirRaid} from '../../../src/server/cards/colonies/AirRaid';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';

describe('ValuableGases', function() {
  let card: ValuableGases;
  let player: TestPlayer;

  let floatingHabs: FloatingHabs;
  let jovianLanters: JovianLanterns;
  let localShading: LocalShading;
  let airRaid: AirRaid;

  beforeEach(function() {
    card = new ValuableGases();
    [/* skipped */, player] = testGame(1);

    // Floating Habs is active, has floaters, and requires 2 science
    floatingHabs = new FloatingHabs();
    // Jovian Lanters is active, has floaters, and requires a jovian tag
    jovianLanters = new JovianLanterns();
    // Local Shading has floaters and no requirements
    localShading = new LocalShading();
    // Air Raid is not a floater card
    airRaid = new AirRaid();
    player.cardsInHand = [floatingHabs, jovianLanters, localShading, airRaid];
  });

  it('Should play', function() {
    expect(player.getPlayableCards()).is.empty;

    // Using playCard instead because playCard impacts lastCardPlayed.
    player.playCard(card);

    runAllActions(player.game);

    const input = player.popWaitingFor();

    const selectProjectCardToPlay = cast(input, SelectProjectCardToPlay);
    expect(selectProjectCardToPlay.cards).has.members([localShading]);
    expect(player.megaCredits).eq(10);

    selectProjectCardToPlay.cb(localShading, {
      heat: 0,
      megaCredits: localShading.cost,
      steel: 0,
      titanium: 0,
      microbes: 0,
      floaters: 0,
      science: 0,
      seeds: 0,
      data: 0,
    });

    expect(localShading.resourceCount).eq(5);

    player.playCard(jovianLanters);
    expect(airRaid.resourceCount).eq(0);
  });
});
