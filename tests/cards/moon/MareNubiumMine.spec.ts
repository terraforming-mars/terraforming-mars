import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MareNubiumMine} from '../../../src/server/cards/moon/MareNubiumMine';
import {MoonSpaces} from '../../../src/common/moon/MoonSpaces';
import {TileType} from '../../../src/common/TileType';

describe('MareNubiumMine', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: MareNubiumMine;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new MareNubiumMine();
  });

  it('can play', () => {
    // TODO(kberg): Ensuring resources is going to require changes coming later.
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.production.steel).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);
    runAllActions(game);

    expect(player.titanium).eq(2);
    expect(player.production.titanium).eq(1);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);

    const mareNubium = moonData.moon.getSpaceOrThrow(MoonSpaces.MARE_NUBIUM);
    expect(mareNubium.player).eq(player);
    expect(mareNubium.tile!.tileType).eq(TileType.MOON_MINE);
  });
});

