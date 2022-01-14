import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {CoreMine} from '../../../src/cards/moon/CoreMine';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {PlaceMoonMineTile} from '../../../src/moon/PlaceMoonMineTile';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('CoreMine', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: CoreMine;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new CoreMine();
  });

  it('play', () => {
    expect(player.getProduction(Resources.TITANIUM)).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);
    expect(player.getProduction(Resources.TITANIUM)).eq(1);
    const placeTileAction = game.deferredActions.peek() as PlaceMoonMineTile;
    placeTileAction!.execute()!.cb(moonData.moon.spaces[2]);

    expect(moonData.miningRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

