import {Game} from '../../../src/server/Game';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MareImbriumMine} from '../../../src/server/cards/moon/MareImbriumMine';
import {expect} from 'chai';
import {MoonSpaces} from '../../../src/common/moon/MoonSpaces';
import {TileType} from '../../../src/common/TileType';

describe('MareImbriumMine', () => {
  let game: Game;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: MareImbriumMine;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new MareImbriumMine();
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
    expect(player.production.steel).eq(1);
    expect(player.production.titanium).eq(1);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);

    const mareImbrium = moonData.moon.getSpace(MoonSpaces.MARE_IMBRIUM);
    expect(mareImbrium.player).eq(player);
    expect(mareImbrium.tile!.tileType).eq(TileType.MOON_MINE);
  });
});

