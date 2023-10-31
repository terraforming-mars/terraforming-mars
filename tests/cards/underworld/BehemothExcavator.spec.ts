import {expect} from 'chai';

import {BehemothExcavator} from '../../../src/server/cards/underworld/BehemothExcavator';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Units} from '../../../src/common/Units';

describe('BehemothExcavator', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: BehemothExcavator;

  beforeEach(() => {
    [game, player] = testGame(1, {underworldExpansion: true});
    card = new BehemothExcavator();
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    expect(card.play(player)).is.undefined;

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
    selectSpace2.cb(space2);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1, titanium: 2}));
    expect(space2.excavator).eq(player);

    runAllActions(game);

    const selectSpace3 = cast(player.popWaitingFor(), SelectSpace);
    const space3 = selectSpace3.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space3.undergroundResources = 'steel2';
    selectSpace3.cb(space3);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1, steel: 2, titanium: 2}));
    expect(space3.excavator).eq(player);

    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
  });
});
