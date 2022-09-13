import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MiningComplex} from '../../../src/server/cards/moon/MiningComplex';
import {expect} from 'chai';
import {PlaceMoonRoadTile} from '../../../src/server/moon/PlaceMoonRoadTile';
import {PlaceMoonMineTile} from '../../../src/server/moon/PlaceMoonMineTile';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('MiningComplex', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: MiningComplex;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    moonData = MoonExpansion.moonData(game);
    card = new MiningComplex();
  });

  it('play', () => {
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);
    expect(moonData.logisticRate).eq(0);
    player.megaCredits = 7;

    card.play(player);

    expect(player.megaCredits).eq(0);

    const placeMineTile = cast(game.deferredActions.pop(), PlaceMoonMineTile);
    placeMineTile.execute()!.cb(moonData.moon.getSpace('m06'));

    expect(moonData.miningRate).eq(1);
    expect(player.getTerraformRating()).eq(15);

    const placeRoadTile = cast(game.deferredActions.pop(), PlaceMoonRoadTile);
    const selectSpace = cast(placeRoadTile.execute(), SelectSpace);
    const spaces = selectSpace.availableSpaces;
    expect(spaces.map((s) => s.id)).to.have.members(['m02', 'm12']);
    selectSpace.cb(spaces[0]);

    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(16);
  });
});
