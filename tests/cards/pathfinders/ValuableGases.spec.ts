import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {ValuableGases} from '../../../src/cards/pathfinders/ValuableGases';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {FloatingHabs} from '../../../src/cards/venusNext/FloatingHabs';
import {JovianLanterns} from '../../../src/cards/colonies/JovianLanterns';
import {LocalShading} from '../../../src/cards/venusNext/LocalShading';
import {AirRaid} from '../../../src/cards/colonies/AirRaid';
import {TestingUtils} from '../../TestingUtils';
import {SelectHowToPayForProjectCard} from '../../../src/inputs/SelectHowToPayForProjectCard';

describe('ValuableGases', function() {
  let card: ValuableGases;
  let player: TestPlayer;
  let game: Game;

  let floatingHabs: FloatingHabs;
  let jovianLanters: JovianLanterns;
  let localShading: LocalShading;
  let airRaid: AirRaid;

  beforeEach(function() {
    card = new ValuableGases();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);

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
    player.playCard(card, undefined, true);

    TestingUtils.runAllActions(player.game);

    const input = player.popWaitingFor();

    const selectHowToPay = TestingUtils.cast(input, SelectHowToPayForProjectCard);
    expect(selectHowToPay.cards).has.members([localShading]);
    expect(player.megaCredits).eq(10);

    selectHowToPay.cb(localShading, {
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

    player.playCard(jovianLanters, undefined, true);
    expect(airRaid.resourceCount).eq(0);
  });
});
