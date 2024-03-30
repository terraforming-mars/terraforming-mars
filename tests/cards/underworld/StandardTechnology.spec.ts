import {expect} from 'chai';
import {forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {StandardTechnology} from '../../../src/server/cards/underworld/StandardTechnology';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {AsteroidStandardProject} from '../../../src/server/cards/base/standardProjects/AsteroidStandardProject';

describe('StandardTechnology', function() {
  let card: StandardTechnology;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(function() {
    card = new StandardTechnology();
    [game, player] = testGame(1);
    player.playedCards.push(card);
  });

  it('play', function() {
    const asteroidStandardProject = new AsteroidStandardProject();

    // First play is standard cost.
    player.stock.megacredits = 13;
    expect(asteroidStandardProject.canAct(player)).eq(false);
    player.stock.megacredits = 14;
    expect(asteroidStandardProject.canAct(player)).eq(true);

    asteroidStandardProject.action(player);
    runAllActions(game);
    expect(player.stock.megacredits).eq(0);

    // Second play is discounted
    player.stock.megacredits = 5;
    expect(asteroidStandardProject.canAct(player)).eq(false);
    player.stock.megacredits = 6;
    expect(asteroidStandardProject.canAct(player)).eq(true);

    asteroidStandardProject.action(player);
    runAllActions(game);
    expect(player.stock.megacredits).eq(0);

    // Next generation
    forceGenerationEnd(game);
    player.stock.megacredits = 13;
    expect(asteroidStandardProject.canAct(player)).eq(false);
    player.stock.megacredits = 14;
    expect(asteroidStandardProject.canAct(player)).eq(true);
  });
});
