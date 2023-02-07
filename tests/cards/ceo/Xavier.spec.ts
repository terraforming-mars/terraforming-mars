import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';

import {Xavier} from '../../../src/server/cards/ceos/Xavier';
import {Cartel} from '../../../src/server/cards/base/Cartel';
import {GeneRepair} from '../../../src/server/cards/base/GeneRepair';
import {LightningHarvest} from '../../../src/server/cards/base/LightningHarvest';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {SulphurExports} from '../../../src/server/cards/venusNext/SulphurExports';


describe('Xavier', function() {
  let card: Xavier;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Xavier();
    game = newTestGame(2, {ceoExtension: true});
    player = getTestPlayer(game, 0);
    player.playedCards.push(card, new SearchForLife());
  });

  it('Takes action once per game: Can play cards with tag requirements', function() {
    const lightningHarvest = new LightningHarvest();
    const geneRepair = new GeneRepair();
    player.cardsInHand.push(lightningHarvest);
    expect(lightningHarvest.canPlay(player)).is.false;

    // Once per game, can gain 2 wild tags for the generation
    card.action();
    player.getActionsThisGeneration().add(card.name);
    expect(lightningHarvest.canPlay(player)).is.true;
    lightningHarvest.play(player);
    expect(geneRepair.canPlay(player)).is.true;

    // Bonus wild tags are lost next generation
    game.deferredActions.runAll(() => {});
    expect(card.isDisabled).is.true;
    player.runProductionPhase();
    expect(geneRepair.canPlay(player)).is.false;
  });

  it('Takes action once per game: Can use wild tags as production', function() {
    const sulphurExports = new SulphurExports();
    player.cardsInHand.push(sulphurExports);

    // Once per game, can gain 2 wild tags for the generation
    card.action();
    player.getActionsThisGeneration().add(card.name);

    // Resolve payment - 2 wild tags count for production effect
    sulphurExports.play(player);
    expect(player.production.megacredits).to.eq(3);

    // Bonus wild tags are lost next generation
    game.deferredActions.runAll(() => {});
    expect(card.isDisabled).is.true;
    player.runProductionPhase();

    const cartel = new Cartel();
    cartel.play(player);
    expect(player.production.megacredits).eq(4);
  });
});
