import {expect} from 'chai';

import {OrbitalLaserDrill} from '../../../src/server/cards/underworld/OrbitalLaserDrill';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Units} from '../../../src/common/Units';

describe('OrbitalLaserDrill', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: OrbitalLaserDrill;

  beforeEach(() => {
    [game, player] = testGame(1, {underworldExpansion: true});
    card = new OrbitalLaserDrill();
  });

  it('can play', () => {
    player.tagsForTest = {science: 1};

    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {science: 2};

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    expect(card.play(player)).is.undefined;

    runAllActions(game);

    const selectSpace1 = cast(player.popWaitingFor(), SelectSpace);
    expect(selectSpace1.spaces).has.length(61);
    const space1 = selectSpace1.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space1.undergroundResources = 'plant1';
    selectSpace1.cb(space1);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1}));
    expect(space1.excavator).eq(player);

    runAllActions(game);

    const selectSpace2 = cast(player.popWaitingFor(), SelectSpace);
    expect(selectSpace2.spaces).has.length(60);
    const space2 = selectSpace2.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space2.undergroundResources = 'titanium2';
    selectSpace2.cb(space2);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1, titanium: 2}));
    expect(space2.excavator).eq(player);

    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
  });
});
