import {expect} from 'chai';

import {TunnelBoringMachine} from '../../../src/server/cards/underworld/TunnelBoringMachine';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Units} from '../../../src/common/Units';

describe('TunnelBoringMachine', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: TunnelBoringMachine;

  beforeEach(() => {
    [game, player] = testGame(1, {underworldExpansion: true});
    card = new TunnelBoringMachine();
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    expect(card.play(player)).is.undefined;
  });

  it('can act', () => {
    player.energy = 2;
    expect(card.canAct(player)).is.false;
    player.energy = 3;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.energy = 3;

    card.action(player);
    runAllActions(game);

    const selectSpace1 = cast(player.popWaitingFor(), SelectSpace);
    const space1 = selectSpace1.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space1.undergroundResources = 'plant1';
    selectSpace1.cb(space1);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1}));
    expect(space1.excavator).eq(player);

    runAllActions(game);

    const selectSpace2 = cast(player.popWaitingFor(), SelectSpace);
    const space2 = selectSpace2.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space2.undergroundResources = 'titanium2';
    selectSpace1.cb(space2);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1, titanium: 2}));
    expect(space2.excavator).eq(player);

    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
  });
});
