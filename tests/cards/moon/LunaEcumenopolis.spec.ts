import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {cast, runAllActions, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunaEcumenopolis} from '../../../src/server/cards/moon/LunaEcumenopolis';
import {expect} from 'chai';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
// import {Phase} from '../../../src/server/Phase';

describe('LunaEcumenopolis', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: LunaEcumenopolis;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    moonData = MoonExpansion.moonData(game);
    card = new LunaEcumenopolis();
  });

  // The part of the moon map being used for this test
  // x   12  13  x   x  ...
  //   17  18  19  x   x ...
  // 22  x   x   25
  //
  // x is not a valid space (it's reserved for mines.)

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const moon = moonData.moon;
    moon.getSpace('m12').tile = {tileType: TileType.MOON_HABITAT};
    moon.getSpace('m19').tile = {tileType: TileType.MOON_HABITAT};

    player.titanium = 2;
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('can play when 1st placement enables 2nd placement', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const moon = moonData.moon;
    moon.getSpace('m18').tile = {tileType: TileType.MOON_HABITAT};
    moon.getSpace('m19').tile = {tileType: TileType.MOON_HABITAT};

    // This test works because space 13 is the only available colony space, but after
    // playing it, space 12 can take a colony.
    player.titanium = 2;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('Cannot play: not enough adjacent colony tiles', () => {
    player.titanium = 2;
    moonData.moon.getSpace('m09').tile = {tileType: TileType.MOON_HABITAT};
    moonData.moon.getSpace('m18').tile = {tileType: TileType.MOON_HABITAT};
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('Place 2 colony tiles', () => {
    moonData.colonyRate = 2;
    const moon = moonData.moon;
    expect(player.getTerraformRating()).eq(14);

    moon.getSpace('m12').tile = {tileType: TileType.MOON_HABITAT};
    moon.getSpace('m19').tile = {tileType: TileType.MOON_HABITAT};
    card.play(player);

    const input1 = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    expect(input1.availableSpaces.map((space) => space.id)).deep.eq(['m13', 'm18']);
    input1.cb(moon.getSpace('m18'));
    expect(moonData.colonyRate).eq(3);
    expect(player.getTerraformRating()).eq(15);

    const input2 = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    expect(input2.availableSpaces.map((space) => space.id)).deep.eq(['m13', 'm17']);
    input1.cb(moon.getSpace('m13'));
    expect(moonData.colonyRate).eq(4);
    runAllActions(game);
    expect(player.getTerraformRating()).eq(18);
  });

  it('can play next to Lunar Mine Urbanization', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const moon = moonData.moon;
    moon.getSpace('m12').tile = {tileType: TileType.LUNAR_MINE_URBANIZATION};
    moon.getSpace('m19').tile = {tileType: TileType.MOON_HABITAT};

    player.titanium = 2;
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('Place 2 colony tiles next to Lunar Mine Urbanization', () => {
    moonData.colonyRate = 2;
    const moon = moonData.moon;
    expect(player.getTerraformRating()).eq(14);

    moon.getSpace('m12').tile = {tileType: TileType.LUNAR_MINE_URBANIZATION};
    moon.getSpace('m19').tile = {tileType: TileType.MOON_HABITAT};
    card.play(player);

    const input1 = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    expect(input1.availableSpaces.map((space) => space.id)).deep.eq(['m13', 'm18']);
    input1.cb(moon.getSpace('m18'));
    expect(moonData.colonyRate).eq(3);
    expect(player.getTerraformRating()).eq(15);

    const input2 = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    expect(input2.availableSpaces.map((space) => space.id)).deep.eq(['m13', 'm17']);
    input1.cb(moon.getSpace('m13'));
    expect(moonData.colonyRate).eq(4);
    runAllActions(game);
    expect(player.getTerraformRating()).eq(18);
  });


  // it('canPlay when Reds are in power', () => {
  //   const player = TestPlayer.BLUE.newPlayer();
  //   const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
  //   const moonData = MoonExpansion.moonData(game);
  //   game.phase = Phase.ACTION;

  //   // Card requirements
  //   player.production.override({plants: 1});

  //   testRedsCosts(() => player.canPlay(card), player, card.cost, 6);
  //   moonData.colonyRate = 8;
  //   testRedsCosts(() => player.canPlay(card), player, card.cost, 3);
  //   (game as any).oxygenLevel = MAX_OXYGEN_LEVEL;
  //   testRedsCosts(() => player.canPlay(card), player, card.cost, 0);
  // });
});
