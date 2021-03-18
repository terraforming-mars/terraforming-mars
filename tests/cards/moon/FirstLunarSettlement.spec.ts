import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {FirstLunarSettlement} from '../../../src/cards/moon/FirstLunarSettlement';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {PlaceMoonColonyTile} from '../../../src/moon/PlaceMoonColonyTile';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('FirstLunarSettlement', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: FirstLunarSettlement;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new FirstLunarSettlement();
  });

  it('play', () => {
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.colonyRate).eq(0);

    card.play(player);
    const placeTileAction = game.deferredActions.peek() as PlaceMoonColonyTile;
    placeTileAction!.execute()!.cb(moonData.moon.spaces[2]);

    expect(moonData.colonyRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

