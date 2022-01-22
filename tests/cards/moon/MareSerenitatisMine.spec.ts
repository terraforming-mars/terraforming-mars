import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {MareSerenitatisMine} from '../../../src/cards/moon/MareSerenitatisMine';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {PlaceMoonRoadTile} from '../../../src/moon/PlaceMoonRoadTile';
import {MoonSpaces} from '../../../src/moon/MoonSpaces';
import {TileType} from '../../../src/common/TileType';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('MareSerenitatisMine', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: MareSerenitatisMine;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new MareSerenitatisMine();
  });

  it('can play', () => {
    // TODO: Ensuring resources is going to require changes coming later.
  });

  it('play', () => {
    player.titanium = 3;
    player.steel = 3;
    expect(player.getProduction(Resources.STEEL)).eq(0);
    expect(player.getProduction(Resources.TITANIUM)).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(1);
    expect(player.steel).eq(2);
    expect(player.getProduction(Resources.STEEL)).eq(1);
    expect(player.getProduction(Resources.TITANIUM)).eq(1);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);

    const mareSerenitatis = moonData.moon.getSpace(MoonSpaces.MARE_SERENITATIS);
    expect(mareSerenitatis.player).eq(player);
    expect(mareSerenitatis.tile!.tileType).eq(TileType.MOON_MINE);

    const deferredAction = game.deferredActions.peek() as PlaceMoonRoadTile;
    const roadSpace = deferredAction.spaces![0];
    expect(roadSpace.tile).is.undefined;
    expect(roadSpace.player).is.undefined;
    expect(moonData.logisticRate).eq(0);

    deferredAction!.execute()!.cb(roadSpace);
    expect(roadSpace.tile!.tileType).eq(TileType.MOON_ROAD);
    expect(roadSpace.player).eq(player);
    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(16);
  });
});

