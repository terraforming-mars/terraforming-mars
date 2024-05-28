import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MareSerenitatisMine} from '../../../src/server/cards/moon/MareSerenitatisMine';
import {MoonSpaces} from '../../../src/common/moon/MoonSpaces';
import {TileType} from '../../../src/common/TileType';
import {assertPlaceTile} from '../../assertions';

describe('MareSerenitatisMine', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: MareSerenitatisMine;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new MareSerenitatisMine();
  });

  it('can play', () => {
    // TODO(kberg): Ensuring resources is going to require changes coming later.
  });

  it('play', () => {
    player.titanium = 3;
    player.steel = 3;
    expect(player.production.steel).eq(0);
    expect(player.production.titanium).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(1);
    expect(player.steel).eq(2);
    expect(player.production.steel).eq(1);
    expect(player.production.titanium).eq(1);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);

    const mareSerenitatis = moonData.moon.getSpaceOrThrow(MoonSpaces.MARE_SERENITATIS);
    expect(mareSerenitatis.player).eq(player);
    expect(mareSerenitatis.tile!.tileType).eq(TileType.MOON_MINE);

    runAllActions(game);
    expect(moonData.logisticRate).eq(0);

    assertPlaceTile(player, player.popWaitingFor(), TileType.MOON_ROAD);

    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(16);
  });
});

