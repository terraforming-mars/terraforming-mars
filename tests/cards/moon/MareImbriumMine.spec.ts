import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MareImbriumMine} from '../../../src/server/cards/moon/MareImbriumMine';
import {NamedMoonSpaces} from '../../../src/common/moon/NamedMoonSpaces';
import {TileType} from '../../../src/common/TileType';

describe('MareImbriumMine', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: MareImbriumMine;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new MareImbriumMine();
  });

  it('can play', () => {
    player.megaCredits = card.cost;
    player.titanium = 0;

    expect(player.canPlay(card)).is.false;

    player.titanium = 1;

    expect(player.canPlay(card)).is.true;
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.production.steel).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);
    runAllActions(game);

    expect(player.titanium).eq(2);
    expect(player.production.steel).eq(1);
    expect(player.production.titanium).eq(1);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);

    const mareImbrium = moonData.moon.getSpaceOrThrow(NamedMoonSpaces.MARE_IMBRIUM);
    expect(mareImbrium.player).eq(player);
    expect(mareImbrium.tile!.tileType).eq(TileType.MOON_MINE);
  });
});

