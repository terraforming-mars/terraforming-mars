import {expect} from 'chai';
import {SpaceRaceToMars} from '../../src/turmoil/globalEvents/SpaceRaceToMars';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {getTestPlayer, newTestGame} from '../TestGame';
import {TileType} from '../../src/TileType';
import {Resources} from '../../src/Resources';
import {Game} from '../../src/Game';
import {TestPlayer} from '../TestPlayer';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {ISpace} from '../../src/boards/ISpace';

let card: SpaceRaceToMars;
let game: Game;
let player: TestPlayer;
let player2: TestPlayer;
let turmoil: Turmoil;
let spaces: Array<ISpace>;

// TODO(kberg): Include the Moon.
describe('SpaceRaceToMars', function() {
  beforeEach(() => {
    card = new SpaceRaceToMars();
    game = newTestGame(2, {turmoilExtension: true});
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    turmoil = game.turmoil!;
    turmoil.initGlobalEvent(game);
    spaces = player.game.board.getAvailableSpacesOnLand(player);
  });
  it('Simple resolve', function() {
    game.simpleAddTile(player, spaces[0], {tileType: TileType.COMMERCIAL_DISTRICT});

    card.resolve(game, turmoil);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(0);
  });

  it('cities do not count', function() {
    // Cities won't doesn't change this card's reward.
    game.simpleAddTile(player, spaces[1], {tileType: TileType.CITY});

    card.resolve(game, turmoil);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(0);
  });

  it('Ocean City counts', function() {
    // Ocean City is supposed to be on an ocean but that doesn't matter for this test.
    game.simpleAddTile(player, spaces[2], {tileType: TileType.OCEAN_CITY});

    card.resolve(game, turmoil);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(0);
  });

  it('Greenery does not count', function() {
    // Greenery won't doesn't change this card's reward.
    game.simpleAddTile(player, spaces[3], {tileType: TileType.GREENERY});

    card.resolve(game, turmoil);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(0);
  });

  it('Other players special tile', function() {
    game.simpleAddTile(player2, spaces[3], {tileType: TileType.LAVA_FLOWS});

    card.resolve(game, turmoil);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(1);
  });

  it('Energy bump', function() {
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player.id);
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);

    expect(player.energy).eq(1);
    expect(player2.energy).eq(3);
  });
});
