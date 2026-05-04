import {expect} from 'chai';

import {ExcavatorLeasing} from '../../../src/server/cards/underworld/ExcavatorLeasing';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {Payment} from '../../../src/common/inputs/Payment';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Units} from '../../../src/common/Units';
import {ExcavateStandardProject} from '../../../src/server/cards/underworld/ExcavateStandardProject';
import {cast} from '../../../src/common/utils/utils';

describe('ExcavatorLeasing', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let card: ExcavatorLeasing;
  let standardProject: ExcavateStandardProject;

  beforeEach(() => {
    [game, player, player2] = testGame(2, {underworldExpansion: true});
    card = new ExcavatorLeasing();
    standardProject = new ExcavateStandardProject();
  });

  it('can act', () => {
    player.megaCredits = 6;
    expect(standardProject.canAct(player)).is.false;
    player.playedCards.push(card);
    expect(standardProject.canAct(player)).is.true;
  });

  it('action', () => {
    player.playedCards.push(card);
    player.megaCredits = 6;

    standardProject.payAndExecute(player, Payment.of({megacredits: standardProject.getAdjustedCost(player)}));
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space.undergroundResources = 'plant2';
    selectSpace.cb(space);

    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 1, plants: 2}));
  });

  it('action - other player', () => {
    player.playedCards.push(card);
    player2.megaCredits = 6;

    standardProject.payAndExecute(player2, Payment.of({megacredits: standardProject.getAdjustedCost(player2)}));
    runAllActions(game);

    const selectSpace = cast(player2.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space.undergroundResources = 'plant2';
    selectSpace.cb(space);

    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 1}));
    expect(player2.stock.asUnits()).deep.eq(Units.of({plants: 2}));
  });
});
