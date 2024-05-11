import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunaEcumenopolis} from '../../../src/server/cards/moon/LunaEcumenopolis';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SubterraneanHabitats} from '../../../src/server/cards/moon/SubterraneanHabitats';
// import {Phase} from '../../../src/server/Phase';

describe('LunaEcumenopolis', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: LunaEcumenopolis;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
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
    moon.getSpaceOrThrow('m12').tile = {tileType: TileType.MOON_HABITAT};
    moon.getSpaceOrThrow('m19').tile = {tileType: TileType.MOON_HABITAT};

    player.titanium = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('can play when 1st placement enables 2nd placement', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const moon = moonData.moon;
    moon.getSpaceOrThrow('m18').tile = {tileType: TileType.MOON_HABITAT};
    moon.getSpaceOrThrow('m19').tile = {tileType: TileType.MOON_HABITAT};

    // This test works because space 13 is the only available colony space, but after
    // playing it, space 12 can take a colony.
    player.titanium = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('Cannot play: not enough adjacent colony tiles', () => {
    player.titanium = 2;
    moonData.moon.getSpaceOrThrow('m09').tile = {tileType: TileType.MOON_HABITAT};
    moonData.moon.getSpaceOrThrow('m18').tile = {tileType: TileType.MOON_HABITAT};
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('Place 2 colony tiles', () => {
    moonData.habitatRate = 2;
    const moon = moonData.moon;
    expect(player.getTerraformRating()).eq(14);

    moon.getSpaceOrThrow('m12').tile = {tileType: TileType.MOON_HABITAT};
    moon.getSpaceOrThrow('m19').tile = {tileType: TileType.MOON_HABITAT};
    card.play(player);

    const input1 = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    expect(input1.spaces.map((space) => space.id)).deep.eq(['m13', 'm18']);
    input1.cb(moon.getSpaceOrThrow('m18'));
    expect(moonData.habitatRate).eq(3);
    expect(player.getTerraformRating()).eq(15);

    const input2 = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    expect(input2.spaces.map((space) => space.id)).deep.eq(['m13', 'm17']);
    input1.cb(moon.getSpaceOrThrow('m13'));
    expect(moonData.habitatRate).eq(4);
    runAllActions(game);
    expect(player.getTerraformRating()).eq(18);
  });

  it('can play next to Lunar Mine Urbanization', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const moon = moonData.moon;
    moon.getSpaceOrThrow('m12').tile = {tileType: TileType.LUNAR_MINE_URBANIZATION};
    moon.getSpaceOrThrow('m19').tile = {tileType: TileType.MOON_HABITAT};

    player.titanium = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('Place 2 colony tiles next to Lunar Mine Urbanization', () => {
    moonData.habitatRate = 2;
    const moon = moonData.moon;
    expect(player.getTerraformRating()).eq(14);

    moon.getSpaceOrThrow('m12').tile = {tileType: TileType.LUNAR_MINE_URBANIZATION};
    moon.getSpaceOrThrow('m19').tile = {tileType: TileType.MOON_HABITAT};
    card.play(player);

    const input1 = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    expect(input1.spaces.map((space) => space.id)).deep.eq(['m13', 'm18']);
    input1.cb(moon.getSpaceOrThrow('m18'));
    expect(moonData.habitatRate).eq(3);
    expect(player.getTerraformRating()).eq(15);

    const input2 = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    expect(input2.spaces.map((space) => space.id)).deep.eq(['m13', 'm17']);
    input1.cb(moon.getSpaceOrThrow('m13'));
    expect(moonData.habitatRate).eq(4);
    runAllActions(game);
    expect(player.getTerraformRating()).eq(18);
  });

  it('Compatible with Subterranean Habitats', () => {
    const moon = moonData.moon;
    player.megaCredits = card.cost;

    moon.getSpaceOrThrow('m12').tile = {tileType: TileType.MOON_HABITAT};
    moon.getSpaceOrThrow('m19').tile = {tileType: TileType.MOON_HABITAT};

    player.titanium = 0;
    expect(player.canPlay(card)).is.false;
    const subterraneanHabitats = new SubterraneanHabitats();
    player.playedCards.push(subterraneanHabitats);
    expect(player.canPlay(card)).is.true;
  });

  // it('canPlay when Reds are in power', () => {
  //   const player = TestPlayer.BLUE.newPlayer();
  //   const game = testGame(1, {moonExpansion: true});
  //   const moonData = MoonExpansion.moonData(game);

  //   // Card requirements
  //   player.production.override({plants: 1});

  //   testRedsCosts(() => player.canPlay(card), player, card.cost, 6);
  //   moonData.habitatRate = 8;
  //   testRedsCosts(() => player.canPlay(card), player, card.cost, 3);
  //   setOxygenLevel(game, MAX_OXYGEN_LEVEL);
  //   testRedsCosts(() => player.canPlay(card), player, card.cost, 0);
  // });
});
