import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MareSerenitatisMine} from '../../../src/server/cards/moon/MareSerenitatisMine';
import {expect} from 'chai';
import {PlaceMoonRoadTile} from '../../../src/server/moon/PlaceMoonRoadTile';
import {MoonSpaces} from '../../../src/common/moon/MoonSpaces';
import {TileType} from '../../../src/common/TileType';

describe('MareSerenitatisMine', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: MareSerenitatisMine;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    moonData = MoonExpansion.moonData(game);
    card = new MareSerenitatisMine();
  });

  it('can play', () => {
    // TODO: Ensuring resources is going to require changes coming later.
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

    const mareSerenitatis = moonData.moon.getSpace(MoonSpaces.MARE_SERENITATIS);
    expect(mareSerenitatis.player).eq(player);
    expect(mareSerenitatis.tile!.tileType).eq(TileType.MOON_MINE);

    const deferredAction = cast(game.deferredActions.peek(), PlaceMoonRoadTile);
    const roadSpace = deferredAction.spaces![0];
    expect(roadSpace.tile).is.undefined;
    expect(roadSpace.player).is.undefined;
    expect(moonData.logisticRate).eq(0);

    deferredAction.execute()!.cb(roadSpace);
    expect(roadSpace.tile!.tileType).eq(TileType.MOON_ROAD);
    expect(roadSpace.player).eq(player);
    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(16);
  });
});

