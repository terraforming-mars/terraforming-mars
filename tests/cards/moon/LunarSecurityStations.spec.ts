import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {LunarSecurityStations} from '../../../src/cards/moon/LunarSecurityStations';
import {expect} from 'chai';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {HiredRaiders} from '../../../src/cards/base/HiredRaiders';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('LunarSecurityStations', () => {
  let game: Game;
  let player: Player;
  let opponent1: Player;
  let opponent2: Player;
  let moonData: IMoonData;
  let lunaSecurityStations: LunarSecurityStations;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    opponent1 = TestPlayers.RED.newPlayer();
    opponent2 = TestPlayers.GREEN.newPlayer();
    game = Game.newInstance('id', [player, opponent1, opponent2], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    lunaSecurityStations = new LunarSecurityStations();
  });


  it('can play', () => {
    player.cardsInHand = [lunaSecurityStations];
    player.megaCredits = lunaSecurityStations.cost;

    const spaces = moonData.moon.getAvailableSpacesOnLand();
    spaces[0].tile = {tileType: TileType.MOON_ROAD};
    spaces[1].tile = {tileType: TileType.MOON_ROAD};
    spaces[2].tile = {tileType: TileType.MOON_ROAD};

    expect(player.getPlayableCards()).includes(lunaSecurityStations);

    spaces[1].tile = {tileType: TileType.MOON_COLONY};
    expect(player.getPlayableCards()).does.not.include(lunaSecurityStations);
  });

  it('protects against Hired Raiders', () => {
    opponent1.steel = 5;
    opponent2.steel = 5;

    const hiredRaiders = new HiredRaiders();

    opponent2.playedCards = [];
    let action = hiredRaiders.play(player) as OrOptions;
    // Options for both opponents.
    expect(action.options).has.lengthOf(2);

    opponent2.playedCards = [lunaSecurityStations];
    action = hiredRaiders.play(player) as OrOptions;
    // Options for only one opponent.
    expect(action.options).has.lengthOf(1);
    action.options[0].cb();
    // And it's the one weithout Luna Security Stations.
    expect(opponent1.steel).to.eq(3);
  });

  it('play', () => {
    expect(player.getTerraformRating()).eq(20);
    expect(moonData.logisticRate).eq(0);

    lunaSecurityStations.play(player);

    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(21);
  });
});

