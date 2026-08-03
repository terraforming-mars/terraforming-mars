import {expect} from 'chai';
import {testGame} from '../TestGame';
import {TestPlayer} from '../TestPlayer';
import {IGame} from '../../src/server/IGame';
import {Board} from '../../src/server/boards/Board';
import {Space} from '../../src/server/boards/Space';
import {MarsBotTilePlacer} from '../../src/server/automa/MarsBotTilePlacer';
import {TileType} from '../../src/common/TileType';
import {SpaceType} from '../../src/common/boards/SpaceType';

describe('MarsBotTilePlacer', () => {
  let game: IGame;
  let human: TestPlayer;
  let marsBot: TestPlayer;
  let tilePlacer: MarsBotTilePlacer;

  beforeEach(() => {
    [game, human, marsBot] = testGame(2);
    tilePlacer = new MarsBotTilePlacer(game, marsBot, human);
  });

  /** An empty land space whose six neighbours are all empty land, so tiles can be arranged around it. */
  function inlandSpace(): Space {
    return game.board.getAvailableSpacesOnLand(marsBot).find((space) => {
      const adj = game.board.getAdjacentSpaces(space);
      return adj.length === 6 && adj.every((s) => s.spaceType === SpaceType.LAND && s.tile === undefined);
    })!;
  }

  describe('findOceanSpace', () => {
    it('finds an ocean-reserved space', () => {
      const space = tilePlacer.findOceanSpace();
      expect(space!.spaceType).to.eq(SpaceType.OCEAN);
    });

    it('returns undefined once every ocean space is taken', () => {
      for (const space of game.board.getAvailableSpacesForOcean(marsBot)) {
        game.simpleAddTile(marsBot, space, {tileType: TileType.OCEAN});
      }
      expect(tilePlacer.findOceanSpace()).is.undefined;
    });
  });

  describe('findCitySpace', () => {
    it('finds a city space', () => {
      expect(tilePlacer.findCitySpace()).is.not.undefined;
    });

    it('prefers a space next to a greenery', () => {
      game.simpleAddTile(human, inlandSpace(), {tileType: TileType.GREENERY});

      const space = tilePlacer.findCitySpace();
      expect(game.board.getAdjacentSpaces(space!).filter(Board.isGreenerySpace)).has.length(1);
    });
  });

  describe('findGreenerySpace', () => {
    it('finds a greenery space', () => {
      game.simpleAddTile(marsBot, inlandSpace(), {tileType: TileType.CITY});

      expect(tilePlacer.findGreenerySpace()).is.not.undefined;
    });
  });

  describe('findExpediteConstructionCitySpace', () => {
    it('returns undefined on an empty board', () => {
      expect(tilePlacer.findExpediteConstructionCitySpace()).is.undefined;
    });

    it('returns undefined when only one greenery is adjacent', () => {
      game.simpleAddTile(human, inlandSpace(), {tileType: TileType.GREENERY});

      expect(tilePlacer.findExpediteConstructionCitySpace()).is.undefined;
    });

    it('finds the space next to two greeneries', () => {
      const [first, second] = game.board.getAdjacentSpaces(inlandSpace());
      game.simpleAddTile(human, first, {tileType: TileType.GREENERY});
      game.simpleAddTile(human, second, {tileType: TileType.GREENERY});

      const space = tilePlacer.findExpediteConstructionCitySpace();
      const adjacent = game.board.getAdjacentSpaces(space!)
        .filter((s) => Board.isGreenerySpace(s) || Board.isOceanSpace(s));
      expect(adjacent).has.length(2);
    });
  });

  describe('tiebreakers', () => {
    it('prefers a space next to an ocean, then the one covering the most bonuses', () => {
      // MarsBot owns no tiles, so every land space is a greenery candidate and they all
      // score 0 on city adjacency. That leaves the tiebreakers to decide.
      const ocean = game.board.getAvailableSpacesForOcean(human)[0];
      game.simpleAddTile(human, ocean, {tileType: TileType.OCEAN});

      const space = tilePlacer.findGreenerySpace()!;
      expect(game.board.getAdjacentSpaces(space).filter(Board.isOceanSpace)).has.length(1);

      const candidates = game.board.getAdjacentSpaces(ocean).filter((s) => game.board.canPlaceTile(s));
      expect(space.bonus.length).to.eq(Math.max(...candidates.map((s) => s.bonus.length)));
    });

    it('draws and discards one project card when spaces are still tied', () => {
      const discarded = game.projectDeck.discardPile.length;

      tilePlacer.findOceanSpace();

      expect(game.projectDeck.discardPile).has.length(discarded + 1);
    });
  });

  describe('placement M€', () => {
    it('pays 1 M€ per bonus icon covered', () => {
      const twoBonuses = game.board.spaces.find((space) => space.bonus.length === 2)!;
      expect(tilePlacer.getPlacementBonusMC(twoBonuses)).to.eq(2);
    });

    it('pays nothing for a space without bonus icons', () => {
      const noBonuses = game.board.spaces.find((space) => space.bonus.length === 0)!;
      expect(tilePlacer.getPlacementBonusMC(noBonuses)).to.eq(0);
    });

    it('pays 2 M€ per adjacent ocean', () => {
      const ocean = game.board.getAvailableSpacesForOcean(marsBot)[0];
      game.simpleAddTile(marsBot, ocean, {tileType: TileType.OCEAN});
      const neighbour = game.board.getAdjacentSpaces(ocean).find((s) => game.board.canPlaceTile(s))!;

      expect(tilePlacer.getOceanAdjacencyMC(neighbour)).to.eq(2);
    });

    it('pays nothing next to an ocean-reserved space with no tile on it', () => {
      const dryOcean = game.board.getAvailableSpacesForOcean(marsBot)[0];
      const neighbour = game.board.getAdjacentSpaces(dryOcean).find((s) => game.board.canPlaceTile(s))!;

      expect(tilePlacer.getOceanAdjacencyMC(neighbour)).to.eq(0);
    });

    it('adds both parts together', () => {
      const ocean = game.board.getAvailableSpacesForOcean(marsBot)[0];
      game.simpleAddTile(marsBot, ocean, {tileType: TileType.OCEAN});
      const neighbour = game.board.getAdjacentSpaces(ocean).find((s) => game.board.canPlaceTile(s))!;

      expect(tilePlacer.getTotalPlacementMC(neighbour)).to.eq(neighbour.bonus.length + 2);
    });
  });
});
