import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MiningComplex} from '../../../src/server/cards/moon/MiningComplex';
import {PlaceMoonRoadTile} from '../../../src/server/moon/PlaceMoonRoadTile';
import {PlaceMoonMineTile} from '../../../src/server/moon/PlaceMoonMineTile';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {cast} from '../../../src/common/utils/utils';

describe('MiningComplex', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: MiningComplex;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new MiningComplex();
  });

  it('can play', () => {
    player.megaCredits = 6;
    expect(card.canPlay(player)).is.false;

    player.megaCredits = 7;
    expect(card.canPlay(player)).is.true;
  });

  it('cannot play when no mine has an adjacent road space', () => {
    player.megaCredits = 7;
    expect(card.canPlay(player)).is.true;

    // Occupy every land space so no road tile can be placed next to any mine.
    for (const space of moonData.moon.spaces) {
      if (space.spaceType === SpaceType.LAND && space.tile === undefined) {
        MoonExpansion.addRoadTile(player, space.id);
      }
    }

    expect(card.canPlay(player)).is.false;
  });

  it('play', () => {
    expect(player.terraformRating).eq(14);
    expect(moonData.miningRate).eq(0);
    expect(moonData.logisticRate).eq(0);
    player.megaCredits = 7;

    card.play(player);

    const placeMineTile = cast(game.deferredActions.pop(), PlaceMoonMineTile);
    placeMineTile.execute()!.cb(moonData.moon.getSpaceOrThrow('m06'));

    expect(moonData.miningRate).eq(1);
    expect(player.terraformRating).eq(15);

    const placeRoadTile = cast(game.deferredActions.pop(), PlaceMoonRoadTile);
    const selectSpace = cast(placeRoadTile.execute(), SelectSpace);
    const spaces = selectSpace.spaces;
    expect(spaces.map((s) => s.id)).to.have.members(['m02', 'm12']);
    selectSpace.cb(spaces[0]);

    runAllActions(game);

    expect(moonData.logisticRate).eq(1);
    expect(player.terraformRating).eq(16);
    expect(player.megaCredits).eq(0);
  });
});
