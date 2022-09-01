import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MareNubiumMine} from '../../../src/server/cards/moon/MareNubiumMine';
import {expect} from 'chai';
import {MoonSpaces} from '../../../src/server/moon/MoonSpaces';
import {TileType} from '../../../src/common/TileType';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('MareNubiumMine', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: MareNubiumMine;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new MareNubiumMine();
  });

  it('can play', () => {
    // TODO: Ensuring resources is going to require changes coming later.
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.production.steel).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.production.titanium).eq(1);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);

    const mareNubium = moonData.moon.getSpace(MoonSpaces.MARE_NUBIUM);
    expect(mareNubium.player).eq(player);
    expect(mareNubium.tile!.tileType).eq(TileType.MOON_MINE);
  });
});

