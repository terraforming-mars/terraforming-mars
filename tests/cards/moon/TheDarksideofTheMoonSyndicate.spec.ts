import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TheDarksideofTheMoonSyndicate} from '../../../src/cards/moon/TheDarksideofTheMoonSyndicate';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {StealResources} from '../../../src/deferredActions/StealResources';
import {TileType} from '../../../src/common/TileType';
import {Phase} from '../../../src/common/Phase';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('TheDarksideofTheMoonSyndicate', () => {
  let player: Player;
  let game: Game;
  let otherPlayer: Player;
  let card: TheDarksideofTheMoonSyndicate;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('id', [player, otherPlayer], player, MOON_OPTIONS);
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

    const options = card.action(player);
    expect(options).is.undefined;
    expect(game.deferredActions).has.length(0);

    expect(player.titanium).eq(2);
    expect(card.resourceCount).eq(1);
  });

  it('action - steal', () => {
    player.titanium = 0;
    card.resourceCount = 3;

    const options = card.action(player);
    expect(options).is.undefined;

    const stealResource = player.game.deferredActions.pop();
    expect(stealResource).is.instanceof(StealResources);
    expect((stealResource as StealResources).count).eq(8);

    expect(card.resourceCount).eq(2);
  });

  it('action - choose', () => {
    player.titanium = 1;
    card.resourceCount = 1;

    const options = card.action(player);
    expect(options).instanceof(OrOptions);

    (options as OrOptions).options[0].cb();
    expect(player.titanium).eq(0);
    expect(card.resourceCount).eq(2);

    (options as OrOptions).options[1].cb();
    expect(game.deferredActions.pop()).is.instanceof(StealResources);
  });

  it('effect', () => {
    const centerSpace = moonData.moon.getSpace('m07');
    const adjacentSpaces = moonData.moon.getAdjacentSpaces(centerSpace);

    // Space 0 intentionallyleft blank
    MoonExpansion.addMineTile(otherPlayer, adjacentSpaces[1].id);
    MoonExpansion.addColonyTile(otherPlayer, adjacentSpaces[2].id);
    MoonExpansion.addRoadTile(otherPlayer, adjacentSpaces[3].id);

    // Active player will be ignored. Also, using direct construction here so as to not trigger
    // corp effect just yet.
    adjacentSpaces[4].tile = {tileType: TileType.MOON_COLONY};
    adjacentSpaces[4].player = player;

    // Test 1: Remove 6 M€ for each of the 3 adjacent spaces.
    otherPlayer.megaCredits = 10;
    player.megaCredits = 0;
    player.corporationCard = card;
    // Trigger the effect.
    MoonExpansion.addMineTile(player, centerSpace.id);
    expect(otherPlayer.megaCredits).eq(4);
    expect(player.megaCredits).eq(6);

    // Test 2: Do it again, but other player doesn't have enough to pay the full costs.
    centerSpace.tile = undefined;
    centerSpace.player = undefined;
    otherPlayer.megaCredits = 5;
    player.megaCredits = 0;
    // Trigger the effect.
    MoonExpansion.addMineTile(player, centerSpace.id);
    expect(otherPlayer.megaCredits).eq(0);
    expect(player.megaCredits).eq(5);
  });

  it('no effect during solar phase', () => {
    const centerSpace = moonData.moon.getSpace('m07');
    const adjacentSpaces = moonData.moon.getAdjacentSpaces(centerSpace);

    // Space 0 intentionallyleft blank
    MoonExpansion.addMineTile(otherPlayer, adjacentSpaces[1].id);
    MoonExpansion.addColonyTile(otherPlayer, adjacentSpaces[2].id);
    MoonExpansion.addRoadTile(otherPlayer, adjacentSpaces[3].id);

    // Active player will be ignored. Also, using direct construction here so as to not trigger
    // corp effect just yet.
    adjacentSpaces[4].tile = {tileType: TileType.MOON_COLONY};
    adjacentSpaces[4].player = player;

    // Test 1: Remove 6 M€ for each of the 3 adjacent spaces.
    otherPlayer.megaCredits = 10;
    player.megaCredits = 0;
    player.corporationCard = card;

    player.game.phase = Phase.SOLAR;

    // Trigger the effect.
    MoonExpansion.addMineTile(player, centerSpace.id);
    expect(otherPlayer.megaCredits).eq(10);
    expect(player.megaCredits).eq(0);
  });
});

