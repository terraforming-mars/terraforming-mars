import {expect} from 'chai';
import {forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {LaborTrafficking} from '../../../src/server/cards/underworld/LaborTrafficking';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {AsteroidStandardProject} from '../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {GreeneryStandardProject} from '../../../src/server/cards/base/standardProjects/GreeneryStandardProject';
import {CollusionStandardProject} from '../../../src/server/cards/underworld/CollusionStandardProject';

describe('LaborTrafficking', function() {
  let card: LaborTrafficking;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(function() {
    card = new LaborTrafficking();
    [game, player] = testGame(1);
    player.playedCards.push(card);
  });

  it('play', function() {
    const asteroidStandardProject = new AsteroidStandardProject();
    const greeneryStandardProject = new GreeneryStandardProject();

    // First play is discounted cost.
    player.megaCredits = 7;
    expect(asteroidStandardProject.canAct(player)).eq(false);
    player.megaCredits = 8;
    expect(asteroidStandardProject.canAct(player)).eq(true);

    player.megaCredits = 16;
    expect(greeneryStandardProject.canAct(player)).eq(false);
    player.megaCredits = 17;
    expect(greeneryStandardProject.canAct(player)).eq(true);

    // Take an action.
    asteroidStandardProject.action(player);
    runAllActions(game);

    // Second play is standard cost
    player.megaCredits = 13;
    expect(asteroidStandardProject.canAct(player)).eq(false);
    player.megaCredits = 14;
    expect(asteroidStandardProject.canAct(player)).eq(true);

    asteroidStandardProject.action(player);
    runAllActions(game);

    player.megaCredits = 22;
    expect(greeneryStandardProject.canAct(player)).eq(false);
    player.megaCredits = 23;
    expect(greeneryStandardProject.canAct(player)).eq(true);

    // Next generation
    forceGenerationEnd(game);
    player.megaCredits = 7;
    expect(asteroidStandardProject.canAct(player)).eq(false);
    player.megaCredits = 8;
    expect(asteroidStandardProject.canAct(player)).eq(true);
  });

  // By and large this is really a StandardProjectCard test,
  // but it works just fine here since this was the source of its report.
  it('Cost does not go negative', () => {
    const card = new LaborTrafficking();
    const [game, player] = testGame(1, {turmoilExtension: true, underworldExpansion: true});
    player.playedCards.push(card);

    const collusionStandardProject = new CollusionStandardProject();

    player.underworldData.corruption = 1;
    expect(collusionStandardProject.canAct(player)).eq(true);

    collusionStandardProject.action(player);
    runAllActions(game);
    expect(player.megaCredits).eq(0);
  });
});
