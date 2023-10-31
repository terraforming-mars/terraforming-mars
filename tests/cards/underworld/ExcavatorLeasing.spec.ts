import {expect} from 'chai';

import {ExcavatorLeasing} from '../../../src/server/cards/underworld/ExcavatorLeasing';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Units} from '../../../src/common/Units';
import {ExcavateStandardProject} from '../../../src/server/cards/underworld/ExcavateStandardProject';

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

    standardProject.action(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space.undergroundResources = 'plant1';
    selectSpace.cb(space);

    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 1, plants: 1}));
  });

  it('action - other player', () => {
    player.playedCards.push(card);
    player2.megaCredits = 6;

    standardProject.action(player2);
    runAllActions(game);

    const selectSpace = cast(player2.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space.undergroundResources = 'plant1';
    selectSpace.cb(space);

    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 1}));
    expect(player2.stock.asUnits()).deep.eq(Units.of({plants: 1}));
  });
});
