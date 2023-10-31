import {expect} from 'chai';
import {SpaceRaceToMars} from '../../../src/server/cards/pathfinders/SpaceRaceToMars';
import {Kelvinists} from '../../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../../TestGame';
import {TileType} from '../../../src/common/TileType';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {Space} from '../../../src/server/boards/Space';

let card: SpaceRaceToMars;
let game: Game;
let player: TestPlayer;
let player2: TestPlayer;
let turmoil: Turmoil;
let spaces: ReadonlyArray<Space>;

// TODO(kberg): Include the Moon.
describe('SpaceRaceToMars', function() {
  beforeEach(() => {
    card = new SpaceRaceToMars();
    [game, player, player2] = testGame(3, {turmoilExtension: true});
    turmoil = game.turmoil!;
    turmoil.initGlobalEvent(game);
    spaces = player.game.board.getAvailableSpacesOnLand(player);
  });
  it('Simple resolve', function() {
    game.simpleAddTile(player, spaces[0], {tileType: TileType.COMMERCIAL_DISTRICT});

    card.resolve(game, turmoil);

    expect(player.production.megacredits).eq(1);
    expect(player2.production.megacredits).eq(0);
  });

  it('cities do not count', function() {
    // Cities won't doesn't change this card's reward.
    game.simpleAddTile(player, spaces[1], {tileType: TileType.CITY});

    card.resolve(game, turmoil);

    expect(player.production.megacredits).eq(0);
    expect(player2.production.megacredits).eq(0);
  });

  it('Ocean City counts', function() {
    // Ocean City is supposed to be on an ocean but that doesn't matter for this test.
    game.simpleAddTile(player, spaces[2], {tileType: TileType.OCEAN_CITY});

    card.resolve(game, turmoil);

    expect(player.production.megacredits).eq(1);
    expect(player2.production.megacredits).eq(0);
  });

  it('Greenery does not count', function() {
    // Greenery won't doesn't change this card's reward.
    game.simpleAddTile(player, spaces[3], {tileType: TileType.GREENERY});

    card.resolve(game, turmoil);

    expect(player.production.megacredits).eq(0);
    expect(player2.production.megacredits).eq(0);
  });

  it('Land-claimed hazard tile does not count', function() {
    // Greenery won't doesn't change this card's reward.
    game.simpleAddTile(player, spaces[3], {tileType: TileType.EROSION_SEVERE});

    card.resolve(game, turmoil);

    expect(player.production.megacredits).eq(0);
    expect(player2.production.megacredits).eq(0);
  });

  it('Other players special tile', function() {
    game.simpleAddTile(player2, spaces[3], {tileType: TileType.LAVA_FLOWS});

    card.resolve(game, turmoil);

    expect(player.production.megacredits).eq(0);
    expect(player2.production.megacredits).eq(1);
  });

  it('Energy bump', function() {
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player);
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);

    expect(player.energy).eq(1);
    expect(player2.energy).eq(3);
  });
});
