import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunaEcumenopolis} from '../../../src/cards/moon/LunaEcumenopolis';
import {expect} from 'chai';
import {TileType} from '../../../src/TileType';
import {SelectSpace} from '../../../src/inputs/SelectSpace';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunaEcumenopolis', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: LunaEcumenopolis;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new LunaEcumenopolis();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 2;
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('raise TR even when no tile placement is possible', () => {
    moonData.colonyRate = 2;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);
    expect(game.deferredActions.pop()!.execute()).is.undefined;
    expect(player.getTerraformRating()).eq(14);
    expect(game.deferredActions.pop()!.execute()).is.undefined;
    expect(player.getTerraformRating()).eq(14);
    game.deferredActions.runAll(() => {});
    expect(player.getTerraformRating()).eq(16);
  });

  // The part of the moon map being used for this test
  // x   12  13  x   x  ...
  //   17  18  19  x   x ...
  // 22  x   x   25
  //
  // x is not a valid space (it's reserved for mines.)

  it('Cannot place a colony when colony tiles are not adjacent', () => {
    moonData.moon.getSpace('m09').tile = {tileType: TileType.MOON_COLONY};
    moonData.moon.getSpace('m18').tile = {tileType: TileType.MOON_COLONY};
    card.play(player);
    expect(game.deferredActions.pop()!.execute()).is.undefined;
  });

  it('Place 2 colony tiles', () => {
    moonData.colonyRate = 2;
    const moon = moonData.moon;
    expect(player.getTerraformRating()).eq(14);

    moon.getSpace('m12').tile = {tileType: TileType.MOON_COLONY};
    moon.getSpace('m19').tile = {tileType: TileType.MOON_COLONY};
    card.play(player);

    const input1 = game.deferredActions.pop()!.execute() as SelectSpace;
    expect(input1.availableSpaces.map((space) => space.id)).deep.eq(['m13', 'm18']);
    input1.cb(moon.getSpace('m18'));
    expect(moonData.colonyRate).eq(3);
    expect(player.getTerraformRating()).eq(15);

    const input2 = game.deferredActions.pop()!.execute() as SelectSpace;
    expect(input2.availableSpaces.map((space) => space.id)).deep.eq(['m13', 'm17']);
    input1.cb(moon.getSpace('m13'));
    expect(moonData.colonyRate).eq(4);
    game.deferredActions.runAll(() => {});
    expect(player.getTerraformRating()).eq(20);
  });
});

