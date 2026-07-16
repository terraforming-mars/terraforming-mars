import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {cast, runAllActions} from '../../TestingUtils';
import {Resource} from '../../../src/common/Resource';
import {SelectProductionToLose} from '../../../src/server/inputs/SelectProductionToLose';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {AresTestHelper} from '../../ares/AresTestHelper';
import {EmptyBoard} from '../../testing/EmptyBoard';
import {Caesar} from '../../../src/server/cards/ceos/Caesar';

describe('Caesar', () => {
  let card: Caesar;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  const startingPlants = 7;

  beforeEach(() => {
    card = new Caesar();
    [game, player, player2] = testGame(2, {aresExtension: true});
    game.board = EmptyBoard.newInstance();
    player.production.add(Resource.PLANTS, startingPlants);
    player2.production.add(Resource.PLANTS, startingPlants);
    runAllActions(game);
  });

  it('Can only act once per game', () => {
    expect(card.canAct(player)).is.true;
    card.action(player);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes action - 5 or less hazards', () => {
    // Sanity checks
    game.generation = 3;
    let hazards = AresTestHelper.getHazards(player);
    expect(hazards).has.length(0);

    // Take Caesar OPG, generation X (place X hazards)
    card.action(player);
    expect(game.deferredActions).has.lengthOf(game.generation+1);

    // Place 3 hazard tiles
    for (let i = 0; i < game.generation; i++) {
      const placeHazard = game.deferredActions.pop()!.execute() as SelectSpace;
      placeHazard.cb(placeHazard.spaces[i]);
    }

    // Make sure all 3 hazards were placed
    hazards = AresTestHelper.getHazards(player);
    expect(hazards).has.length(3);
    game.deferredActions.runNext();

    // Opponents lose 1 production
    runAllActions(game);
    const input = cast(player2.getWaitingFor(), SelectProductionToLose);
    expect(input.unitsToLose).eq(1);
    input.cb(Units.of({plants: 1}));
    expect(player2.production.plants).eq(startingPlants - 1);
  });

  it('Takes action - more than 5 hazards', () => {
    game.generation = 6;
    // Sanity check to make sure there are no Hazards on the map
    let hazards = AresTestHelper.getHazards(player);
    expect(hazards).has.length(0);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(game.generation+1);
    // Place game.generation hazard tiles
    for (let i = 0; i < game.generation; i++) {
      const placeHazard = game.deferredActions.pop()!.execute() as SelectSpace;
      placeHazard.cb(placeHazard.spaces[i]);
    }

    // Make sure there are now 6 hazards
    hazards = AresTestHelper.getHazards(player);
    expect(hazards).has.length(game.generation);
    game.deferredActions.runNext();

    // Opponents lose 2 production
    runAllActions(game);
    const input = cast(player2.getWaitingFor(), SelectProductionToLose);
    expect(input.unitsToLose).eq(2);
    input.cb(Units.of({plants: 2}));
    expect(player2.production.plants).eq(startingPlants - 2);
  });
});
