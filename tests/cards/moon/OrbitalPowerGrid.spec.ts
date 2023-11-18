import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {OrbitalPowerGrid} from '../../../src/server/cards/moon/OrbitalPowerGrid';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';

describe('OrbitalPowerGrid', () => {
  let player: TestPlayer;
  let card: OrbitalPowerGrid;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new OrbitalPowerGrid();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    expect(player.production.energy).eq(0);

    const colonySpaces = player.game.board.spaces.filter((s) => s.spaceType === SpaceType.COLONY);
    colonySpaces[0].tile = {tileType: TileType.CITY};
    colonySpaces[1].tile = {tileType: TileType.CITY};

    card.play(player);

    expect(player.production.energy).eq(2);
  });

  it('play - ignore cities on mars', () => {
    expect(player.production.energy).eq(0);

    const colonySpaces = player.game.board.spaces.filter((s) => s.spaceType === SpaceType.COLONY);
    colonySpaces[0].tile = {tileType: TileType.CITY};
    colonySpaces[1].tile = {tileType: TileType.CITY};

    const landSpaces = player.game.board.getAvailableSpacesOnLand(player);
    landSpaces[0].tile = {tileType: TileType.CITY};
    landSpaces[1].tile = {tileType: TileType.CITY};
    landSpaces[2].tile = {tileType: TileType.CITY};

    card.play(player);

    expect(player.production.energy).eq(2);
  });
});

