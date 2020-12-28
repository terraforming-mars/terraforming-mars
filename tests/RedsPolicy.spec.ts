import {expect} from 'chai';
import {Color} from '../src/Color';
import {Player} from '../src/Player';
import {Game, GameOptions} from '../src/Game';
import {BoardName} from '../src/boards/BoardName';
import {IceAsteroid} from '../src/cards/base/IceAsteroid';
import {LavaFlows} from '../src/cards/base/LavaFlows';
import {NuclearZone} from '../src/cards/base/NuclearZone';
import {ProtectedValley} from '../src/cards/base/ProtectedValley';
import {SpaceName} from '../src/SpaceName';
import {SpaceType} from '../src/SpaceType';
import {TileType} from '../src/TileType';
import {resetBoard, getSpaceById, setCustomGameOptions} from './TestingUtils';
import {ActionDetails, RedsPolicy} from '../src/turmoil/RedsPolicy';

describe('RedsPolicy', function() {
  let player : Player;
  let game : Game;
  let iceAsteroid: ActionDetails;
  let lavaFlows: ActionDetails;
  let protectedValley: ActionDetails;

  beforeEach(function() {
    player = new Player('test', Color.BLUE, false);
    const gameOptions = setCustomGameOptions() as GameOptions;
    game = Game.newInstance('foobar', [player], player, gameOptions);
    resetBoard(game);
    iceAsteroid = new ActionDetails({
      card: new IceAsteroid(),
      oceansToPlace: 2,
      oceansAvailableSpaces: game.board.getAvailableSpacesForOcean(player),
    });
    lavaFlows = new ActionDetails({
      card: new LavaFlows(),
      temperatureIncrease: 2,
      nonOceanToPlace: TileType.LAVA_FLOWS,
      nonOceanAvailableSpaces: LavaFlows.getVolcanicSpaces(player, game),
    });
    protectedValley = new ActionDetails({
      card: new ProtectedValley(),
      oxygenIncrease: 1,
      nonOceanToPlace: TileType.GREENERY,
      nonOceanAvailableSpaces: game.board.getAvailableSpacesForOcean(player),
      megaCreditsProduction: 2,
    });
  });

  it('Should work', function() {
    // Playing Protected Valley costs 23 + 3 = 26
    // Playing Ice Asteroid costs 23 + 3*2 = 29

    player.megaCredits = 23;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, protectedValley, true).canAfford).is.false;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true).canAfford).is.false;

    player.megaCredits = 26;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, protectedValley, true).canAfford).is.true;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true).canAfford).is.false;

    player.megaCredits = 29;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, protectedValley, true).canAfford).is.true;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true).canAfford).is.true;
  });

  it('Should work whith placement bonus', function() {
    player.megaCredits = 27;

    // Can gain 2 MC from placing the 2nd ocean next to the first one
    const test = RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true);
    expect(test.canAfford).is.true;
    expect(test.spaces!.size).to.be.gte(1);
  });

  it('Should work with Lava Flows', function() {
    player.megaCredits = 22;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, lavaFlows).canAfford).is.false;


    player.megaCredits = 25;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, lavaFlows).canAfford).is.true;


    (game as any).temperature = -2;
    const test3 = RedsPolicy.canAffordRedsPolicy(player, game, lavaFlows); // 18 + 3*3
    expect(test3.canAfford).is.true;
    const spaces = test3.spaces!;
    const ocean04 = getSpaceById(game, '04');
    const tharsisThollus = getSpaceById(game, '09');
    expect(spaces).has.lengthOf(1);
    expect(spaces).to.have.keys(ocean04);
    expect(spaces.get(ocean04) as any).has.lengthOf(1);
    expect(spaces.get(ocean04) as any).to.have.keys(tharsisThollus);


    // Placing a greenery on 04
    game.addGreenery(player, '04', SpaceType.OCEAN, false);
    expect(RedsPolicy.canAffordRedsPolicy(player, game, lavaFlows).canAfford).is.false;
  });

  it('Should prevent placing on the South Pole', function() {
    game = Game.newInstance('foobar', [player], player, setCustomGameOptions({boardName: BoardName.HELLAS}));
    resetBoard(game);

    player.megaCredits = 6; // Needed so that getAvailableSpacesOnLand also returns South Pole
    const nuclearZone = new ActionDetails({
      card: new NuclearZone(),
      temperatureIncrease: 2,
      nonOceanToPlace: TileType.NUCLEAR_ZONE,
      nonOceanAvailableSpaces: game.board.getAvailableSpacesOnLand(player),
    });
    const southPole = getSpaceById(game, SpaceName.HELLAS_OCEAN_TILE);

    // Nuclear Zone costs 10 + 3*2 = 16, adding South Pole, need a total of 25 (16 + 6 + 3)
    player.megaCredits = 22;
    const cannotAfford = RedsPolicy.canAffordRedsPolicy(player, game, nuclearZone, true);
    expect(cannotAfford.canAfford).is.true;
    const cannotAffordSpaces = cannotAfford.spaces!;
    expect(cannotAffordSpaces).has.lengthOf(48); // 61 board spaces - 12 oceans spaces - 1 South Pole
    expect(cannotAffordSpaces).to.not.have.keys(southPole);

    player.megaCredits = 30;
    const canAfford = RedsPolicy.canAffordRedsPolicy(player, game, nuclearZone, true);
    expect(canAfford.canAfford).is.true;
    const canAffordSpaces = canAfford.spaces!;
    expect(canAffordSpaces).has.lengthOf(49);
    expect(canAffordSpaces).to.have.any.keys(southPole);
  });
});
