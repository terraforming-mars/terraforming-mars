import {expect} from 'chai';
import {cast, fakeCard, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {LaborTrafficking} from '../../../src/server/cards/underworld/LaborTrafficking';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {AsteroidStandardProject} from '../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {GreeneryStandardProject} from '../../../src/server/cards/base/standardProjects/GreeneryStandardProject';
import {CollusionStandardProject} from '../../../src/server/cards/underworld/CollusionStandardProject';
import {CardName} from '../../../src/common/cards/CardName';
import {SellPatentsStandardProject} from '../../../src/server/cards/base/standardProjects/SellPatentsStandardProject';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {PowerPlantStandardProject} from '../../../src/server/cards/base/standardProjects/PowerPlantStandardProject';

describe('LaborTrafficking', () => {
  let card: LaborTrafficking;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new LaborTrafficking();
    [game, player] = testGame(1);
    player.playedCards.push(card);
  });

  it('play', () => {
    const asteroidStandardProject = new AsteroidStandardProject();
    const greeneryStandardProject = new GreeneryStandardProject();

    // First play is discounted cost.
    player.megaCredits = 7;
    expect(asteroidStandardProject.canAct(player)).is.false;
    player.megaCredits = 8;
    expect(asteroidStandardProject.canAct(player)).is.true;

    player.megaCredits = 16;
    expect(greeneryStandardProject.canAct(player)).is.false;
    player.megaCredits = 17;
    expect(greeneryStandardProject.canAct(player)).is.true;

    expect(player.actionsThisGeneration).does.not.include(CardName.LABOR_TRAFFICKING);

    // Take an action.
    asteroidStandardProject.action(player);
    runAllActions(game);

    expect(player.actionsThisGeneration).includes(CardName.LABOR_TRAFFICKING);

    // Second play is standard cost
    player.megaCredits = 13;
    expect(asteroidStandardProject.canAct(player)).is.false;
    player.megaCredits = 14;
    expect(asteroidStandardProject.canAct(player)).is.true;

    asteroidStandardProject.action(player);
    runAllActions(game);

    player.megaCredits = 22;
    expect(greeneryStandardProject.canAct(player)).is.false;
    player.megaCredits = 23;
    expect(greeneryStandardProject.canAct(player)).is.true;

    // Next generation
    forceGenerationEnd(game);

    expect(player.actionsThisGeneration).does.not.include(CardName.LABOR_TRAFFICKING);

    player.megaCredits = 7;
    expect(asteroidStandardProject.canAct(player)).is.false;
    player.megaCredits = 8;
    expect(asteroidStandardProject.canAct(player)).is.true;
  });

  // By and large this is really a StandardProjectCard test,
  // but it works just fine here since this was the source of its report.
  it('Cost does not go negative', () => {
    const card = new LaborTrafficking();
    const [game, player] = testGame(1, {turmoilExtension: true, underworldExpansion: true});
    player.playedCards.push(card);

    const collusionStandardProject = new CollusionStandardProject();

    player.underworldData.corruption = 1;
    expect(collusionStandardProject.canAct(player)).is.true;

    collusionStandardProject.action(player);
    runAllActions(game);
    expect(player.megaCredits).eq(0);
  });

  it('Does not work with Sell Patents', () => {
    const card = new LaborTrafficking();
    const [/* game */, player] = testGame(1);
    player.playedCards.push(card);
    player.cardsInHand.push(fakeCard());

    const sellPatentsStandardProject = new SellPatentsStandardProject();
    const selectCard = cast(sellPatentsStandardProject.action(player), SelectCard);
    selectCard.cb([]);

    const powerPlantStandardProject = new PowerPlantStandardProject();

    player.megaCredits = 4;
    expect(powerPlantStandardProject.canAct(player)).is.false;
    player.megaCredits = 5;
    expect(powerPlantStandardProject.canAct(player)).is.true;
  });
});
