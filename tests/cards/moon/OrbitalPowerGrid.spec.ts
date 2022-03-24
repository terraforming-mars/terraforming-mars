import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {OrbitalPowerGrid} from '../../../src/cards/moon/OrbitalPowerGrid';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('OrbitalPowerGrid', () => {
  let player: Player;
  let card: OrbitalPowerGrid;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new OrbitalPowerGrid();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    expect(player.getProduction(Resources.ENERGY)).eq(0);

    const colonySpaces = player.game.board.spaces.filter((s) => s.spaceType === SpaceType.COLONY);
    colonySpaces[0].tile = {tileType: TileType.CITY};
    colonySpaces[1].tile = {tileType: TileType.CITY};

    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).eq(2);
  });

  it('play - ignore cities on mars', () => {
    expect(player.getProduction(Resources.ENERGY)).eq(0);

    const colonySpaces = player.game.board.spaces.filter((s) => s.spaceType === SpaceType.COLONY);
    colonySpaces[0].tile = {tileType: TileType.CITY};
    colonySpaces[1].tile = {tileType: TileType.CITY};

    const landSpaces = player.game.board.getAvailableSpacesOnLand(player);
    landSpaces[0].tile = {tileType: TileType.CITY};
    landSpaces[1].tile = {tileType: TileType.CITY};
    landSpaces[2].tile = {tileType: TileType.CITY};

    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).eq(2);
  });
});

