import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {cast, runAllActions} from '../../TestingUtils';
import {Resources} from '../../../src/common/Resources';

import {SelectProductionToLose} from '../../../src/server/inputs/SelectProductionToLose';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {AresTestHelper, ARES_OPTIONS_NO_HAZARDS, ARES_OPTIONS_WITH_HAZARDS} from '../../ares/AresTestHelper';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {forceGenerationEnd} from '../../TestingUtils';
import {Caesar} from '../../../src/server/cards/ceos/Caesar';

describe('Caesar', function() {
  let card: Caesar;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Caesar();
    game = newTestGame(2, ARES_OPTIONS_NO_HAZARDS);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    game.board = EmptyBoard.newInstance();
    forceGenerationEnd(game);
    forceGenerationEnd(game);
  });

  it('Can only act once per game', function() {
    expect(card.canAct(player)).is.true;
    card.action(player);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes action - 5 or less hazards', function() {
    // Sanity checks
    expect(game.generation).to.eq(3);
    let hazards = AresTestHelper.getHazards(player);
    expect(hazards.length).to.eq(0);

    const startingPlants = 7;
    player.production.add(Resources.PLANTS, startingPlants);
    player2.production.add(Resources.PLANTS, startingPlants);
    runAllActions(game);

    // Take Caesar OPG, generation 3 (place 3 hazards)
    card.action(player);
    expect(game.deferredActions).has.lengthOf(4);

    // Place 3 hazard tiles
    for (let i = 0; i < 3; i++) {
      const placeHazard = game.deferredActions.pop()!.execute() as SelectSpace;
      placeHazard.cb(placeHazard.availableSpaces[i]);
    }

    // Make sure all 3 hazards were placed
    hazards = AresTestHelper.getHazards(player);
    expect(hazards.length).to.eq(3);

    // game.deferredActions.runNext();

    // Opponents lose 1 production
    const input = cast(player2.getWaitingFor(), SelectProductionToLose);
    expect(input.unitsToLose).eq(1);
    input.cb(Units.of({plants: 1}));
    expect(player2.production.plants).eq(startingPlants - 1);
  });

  it('Takes action - more than 5 hazards', function() {
    // Sanity check to make sure there are no Hazards on the map
    let hazards = AresTestHelper.getHazards(player);
    expect(hazards.length).to.eq(0);

    const startingPlants = 7;
    game = newTestGame(2, ARES_OPTIONS_WITH_HAZARDS);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player.production.add(Resources.PLANTS, startingPlants);
    player2.production.add(Resources.PLANTS, startingPlants);
    runAllActions(game);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(4);

    // Place 3 hazard tiles
    for (let i = 0; i < 3; i++) {
      const placeHazard = game.deferredActions.pop()!.execute() as SelectSpace;
      placeHazard.cb(placeHazard.availableSpaces[i]);
    }

    // Make sure there are now 6 hazards
    hazards = AresTestHelper.getHazards(player);
    expect(hazards.length).to.eq(6);

    game.deferredActions.runNext();

    // Opponents lose 2 production
    runAllActions(game);
    const input = cast(player2.getWaitingFor(), SelectProductionToLose);
    expect(input.unitsToLose).eq(2);
    input.cb(Units.of({plants: 2}));
    expect(player2.production.plants).eq(startingPlants - 2);
  });
});
