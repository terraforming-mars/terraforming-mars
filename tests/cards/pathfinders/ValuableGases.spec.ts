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

  beforeEach(function() {
    card = new ValuableGases();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    // Floating Habs is active, has floaters, and requires 2 science
    const floatingHabs = new FloatingHabs();
    // Jovian Lanters is active, has floaters, and requires a jovian tag
    const jovianLanters = new JovianLanterns();
    // Local Shading has floaters and no requirements
    const localShading = new LocalShading();
    // Air Raid is not a floater card
    const airRaid = new AirRaid();

    player.cardsInHand = [floatingHabs, jovianLanters, localShading, airRaid];
    card.play(player);

    TestingUtils.runAllActions(player.game);

    const input = player.getWaitingFor();
    expect(input).is.instanceOf(SelectHowToPayForProjectCard);
    expect((input as SelectHowToPayForProjectCard).cards).has.members(
      [floatingHabs, jovianLanters, localShading]);
    expect(player.megaCredits).eq(10);
  });
});
