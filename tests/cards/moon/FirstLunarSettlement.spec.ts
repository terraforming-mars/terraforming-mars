import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {cast, setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {FirstLunarSettlement} from '../../../src/server/cards/moon/FirstLunarSettlement';
import {expect} from 'chai';
import {PlaceMoonColonyTile} from '../../../src/server/moon/PlaceMoonColonyTile';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('FirstLunarSettlement', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: FirstLunarSettlement;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new FirstLunarSettlement();
  });

  it('play', () => {
    expect(player.production.megacredits).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.colonyRate).eq(0);

    card.play(player);
    const placeTileAction = cast(game.deferredActions.peek(), PlaceMoonColonyTile);
    placeTileAction.execute()!.cb(moonData.moon.spaces[2]);

    expect(moonData.colonyRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

