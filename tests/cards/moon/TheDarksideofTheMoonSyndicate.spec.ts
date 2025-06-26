import {IGame} from '../../../src/server/IGame';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TheDarksideofTheMoonSyndicate} from '../../../src/server/cards/moon/TheDarksideofTheMoonSyndicate';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TileType} from '../../../src/common/TileType';
import {Phase} from '../../../src/common/Phase';
import {testGame} from '../../TestGame';

describe('TheDarksideofTheMoonSyndicate', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let card: TheDarksideofTheMoonSyndicate;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player, player2, player3] = testGame(3, {moonExpansion: true});
    card = new TheDarksideofTheMoonSyndicate();
    moonData = MoonExpansion.moonData(game);
  });

  it('can act', () => {
    player.titanium = 1;
    card.resourceCount = 0;
    expect(card.canAct(player)).is.true;

    player.titanium = 0;
    card.resourceCount = 1;
    expect(card.canAct(player)).is.true;

    player.titanium = 0;
    card.resourceCount = 0;
    expect(card.canAct(player)).is.false;
  });

  it('action - add resource', () => {
    player.titanium = 3;
    card.resourceCount = 0;

    cast(card.action(player), undefined);
    expect(game.deferredActions).has.length(0);

    expect(player.titanium).eq(2);
    expect(card.resourceCount).eq(1);
  });

  it('action - steal', () => {
    player.titanium = 0;
    card.resourceCount = 3;

    player.megaCredits = 5;
    player2.megaCredits = 5;
    player3.megaCredits = 5;

    cast(card.action(player), undefined);

    runAllActions(game);
    cast(player.getWaitingFor(), undefined);

    expect(card.resourceCount).eq(2);
    expect(player.megaCredits).eq(9);
    expect(player2.megaCredits).eq(3);
    expect(player3.megaCredits).eq(3);
  });

  it('action - choose', () => {
    player.titanium = 1;
    card.resourceCount = 1;

    player.megaCredits = 5;
    player2.megaCredits = 5;
    player3.megaCredits = 5;

    const options = cast(card.action(player), OrOptions);

    options.options[0].cb();
    runAllActions(game);
    cast(player.getWaitingFor(), undefined);
    expect(player.titanium).eq(0);
    expect(card.resourceCount).eq(2);

    options.options[1].cb();
    runAllActions(game);
    cast(player.getWaitingFor(), undefined);

    expect(card.resourceCount).eq(1);
    expect(player.megaCredits).eq(9);
    expect(player2.megaCredits).eq(3);
    expect(player3.megaCredits).eq(3);
  });

  it('steal in solo mode', () => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);

    player.titanium = 0;
    card.resourceCount = 3;

    player.megaCredits = 5;

    cast(card.action(player), undefined);
    runAllActions(game);

    expect(card.resourceCount).eq(2);
    expect(player.megaCredits).eq(7);
  });

  it('effect', () => {
    const centerSpace = moonData.moon.getSpaceOrThrow('m07');
    const adjacentSpaces = moonData.moon.getAdjacentSpaces(centerSpace);

    // Space 0 intentionallyleft blank
    MoonExpansion.addMineTile(player2, adjacentSpaces[1].id);
    MoonExpansion.addHabitatTile(player2, adjacentSpaces[2].id);
    MoonExpansion.addRoadTile(player2, adjacentSpaces[3].id);

    // Active player will be ignored. Also, using direct construction here so as to not trigger
    // corp effect just yet.
    adjacentSpaces[4].tile = {tileType: TileType.MOON_HABITAT};
    adjacentSpaces[4].player = player;

    // Test 1: Remove 6 M€ for each of the 3 adjacent spaces.
    player2.megaCredits = 10;
    player.megaCredits = 0;
    player.corporations.push(card);
    // Trigger the effect.
    MoonExpansion.addMineTile(player, centerSpace.id);
    expect(player2.megaCredits).eq(4);
    expect(player.megaCredits).eq(6);

    // Test 2: Do it again, but other player doesn't have enough to pay the full costs.
    centerSpace.tile = undefined;
    centerSpace.player = undefined;
    player2.megaCredits = 5;
    player.megaCredits = 0;
    // Trigger the effect.
    MoonExpansion.addMineTile(player, centerSpace.id);
    expect(player2.megaCredits).eq(0);
    expect(player.megaCredits).eq(5);
  });

  it('no effect during solar phase', () => {
    const centerSpace = moonData.moon.getSpaceOrThrow('m07');
    const adjacentSpaces = moonData.moon.getAdjacentSpaces(centerSpace);

    // Space 0 intentionallyleft blank
    MoonExpansion.addMineTile(player2, adjacentSpaces[1].id);
    MoonExpansion.addHabitatTile(player2, adjacentSpaces[2].id);
    MoonExpansion.addRoadTile(player2, adjacentSpaces[3].id);

    // Active player will be ignored. Also, using direct construction here so as to not trigger
    // corp effect just yet.
    adjacentSpaces[4].tile = {tileType: TileType.MOON_HABITAT};
    adjacentSpaces[4].player = player;

    // Test 1: Remove 6 M€ for each of the 3 adjacent spaces.
    player2.megaCredits = 10;
    player.megaCredits = 0;
    player.corporations.push(card);

    player.game.phase = Phase.SOLAR;

    // Trigger the effect.
    MoonExpansion.addMineTile(player, centerSpace.id);
    expect(player2.megaCredits).eq(10);
    expect(player.megaCredits).eq(0);
  });
});

