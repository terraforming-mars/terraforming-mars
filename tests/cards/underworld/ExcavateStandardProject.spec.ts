import {expect} from 'chai';

import {ExcavateStandardProject} from '../../../src/server/cards/underworld/ExcavateStandardProject';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Units} from '../../../src/common/Units';

describe('ExcavateStandardProject', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: ExcavateStandardProject;

  beforeEach(() => {
    [game, player] = testGame(1, {underworldExpansion: true});
    card = new ExcavateStandardProject();
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    cast(card.play(player), undefined);
  });

  it('can act', () => {
    player.megaCredits = 6;
    expect(card.canAct(player)).is.false;
    player.megaCredits = 7;
    expect(card.canAct(player)).is.true;

    player.megaCredits = 2;
    player.steel = 2;
    expect(card.canAct(player)).is.false;

    player.megaCredits = 3;
    player.steel = 2;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.megaCredits = 7;

    card.action(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space.undergroundResources = 'plant1';
    selectSpace.cb(space);

    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 0, plants: 1}));
    expect(space.excavator).eq(player);

    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
  });
});
