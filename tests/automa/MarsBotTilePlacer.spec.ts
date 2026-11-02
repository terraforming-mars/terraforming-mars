import {expect} from 'chai';
import {testGame} from '../TestGame';
import {TestPlayer} from '../TestPlayer';
import {IGame} from '../../src/server/IGame';
import {Space} from '../../src/server/boards/Space';
import {MarsBotTilePlacer} from '../../src/server/automa/MarsBotTilePlacer';
import {TileType} from '../../src/common/TileType';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {SpaceBonus} from '../../src/common/boards/SpaceBonus';
import {SpaceName} from '../../src/common/boards/SpaceName';
import {cast, toID} from '@/common/utils/utils';
import {fakeCard, maxOutOceans, setTemperature} from '../TestingUtils';
import {fakeMarsBot} from './FakeMarsBot';
import {BoardName} from '@/common/boards/BoardName';
import {SpaceId} from '@/common/Types';
import {GameOptions} from '@/server/game/GameOptions';
import {IAward} from '@/server/awards/IAward';
import {IMilestone} from '@/server/milestones/IMilestone';
import {Founder} from '@/server/awards/modular/Founder';
import {Highlander} from '@/server/awards/modular/Highlander';
import {Suburbian} from '@/server/awards/modular/Suburbian';
import {Geologist} from '@/server/milestones/modular/Geologist';

describe('MarsBotTilePlacer', () => {
  let game: IGame;
  let human: TestPlayer;
  let marsBot: TestPlayer;
  let tilePlacer: MarsBotTilePlacer;

  beforeEach(() => {
    [game, human, marsBot] = testGame(2);
    tilePlacer = new MarsBotTilePlacer(game, marsBot, human);
  });

  // TODO(kberg): Move to TestingUtils.
  /** An empty land space whose six neighbours are all empty land, so tiles can be arranged around it. */
  function inlandSpace(): Space {
    return game.board.getAvailableSpacesOnLand(marsBot).find((space) => {
      const adj = game.board.getAdjacentSpaces(space);
      return adj.length === 6 && adj.every((s) => s.spaceType === SpaceType.LAND && s.tile === undefined);
    })!;
  }

  it('findOceanSpace finds an ocean-reserved space', () => {
    const space = tilePlacer.findOceanSpace();

    expect(space!.spaceType).to.eq(SpaceType.OCEAN);
  });

  it('findOceanSpace returns undefined once every ocean space is taken', () => {
    for (const space of game.board.getAvailableSpacesForOcean(marsBot)) {
      game.simpleAddTile(marsBot, space, {tileType: TileType.OCEAN});
    }

    cast(tilePlacer.findOceanSpace(), undefined);
  });

  it('findCitySpace finds a city space', () => {
    expect(tilePlacer.findCitySpace()).is.not.undefined;
  });

  it('findCitySpace prefers a space next to a greenery', () => {
    const greenery = inlandSpace();
    game.simpleAddTile(human, greenery, {tileType: TileType.GREENERY});

    const space = tilePlacer.findCitySpace()!;

    expect(game.board.getAdjacentSpaces(space).some((s) => s.id === greenery.id)).is.true;
  });

  it('findGreenerySpace finds a space next to one of MarsBot\'s tiles', () => {
    const city = inlandSpace();
    game.simpleAddTile(marsBot, city, {tileType: TileType.CITY});

    const space = tilePlacer.findGreenerySpace()!;

    expect(game.board.getAdjacentSpaces(space).some((s) => s.id === city.id)).is.true;
  });

  it('findGreenerySpace prefers a space next to two of MarsBot\'s cities', () => {
    const first = inlandSpace();
    const second = game.board.getAdjacentSpaces(first)[0];
    game.simpleAddTile(marsBot, first, {tileType: TileType.CITY});
    game.simpleAddTile(marsBot, second, {tileType: TileType.CITY});

    const space = tilePlacer.findGreenerySpace()!;

    const adjacent = game.board.getAdjacentSpaces(space).map(toID);
    expect(adjacent).to.include.members([first.id, second.id]);
  });

  it('findGreenerySpace avoids the human\'s cities', () => {
    // Of the spaces next to MarsBot's city at 17, only 25 covers two bonus icons, so the
    // tiebreakers alone would choose it. The human city at 18 next door is what rules it out.
    game.simpleAddTile(marsBot, game.board.getSpaceOrThrow('17'), {tileType: TileType.CITY});
    game.simpleAddTile(human, game.board.getSpaceOrThrow('18'), {tileType: TileType.CITY});

    const space = tilePlacer.findGreenerySpace()!;

    expect(space.id).to.eq('24');
    expect(game.board.getAdjacentSpaces(space).some((s) => s.id === '18')).is.false;
  });

  it('findGreenerySpace goes for the greatest net gain of points', () => {
    // 17 is next to two of MarsBot's cities and two of the human's, so a greenery there gains MarsBot
    // nothing. One next to a single MarsBot city and no human one gains a point.
    game.simpleAddTile(marsBot, game.board.getSpaceOrThrow('10'), {tileType: TileType.CITY});
    game.simpleAddTile(marsBot, game.board.getSpaceOrThrow('25'), {tileType: TileType.CITY});
    game.simpleAddTile(human, game.board.getSpaceOrThrow('11'), {tileType: TileType.CITY});
    game.simpleAddTile(human, game.board.getSpaceOrThrow('24'), {tileType: TileType.CITY});

    const space = tilePlacer.findGreenerySpace()!;

    const cities = game.board.getAdjacentSpaces(space).filter((s) => s.tile?.tileType === TileType.CITY);
    expect(cities.map((s) => s.player?.id)).deep.eq([marsBot.id]);
  });

  it('findExpeditedConstructionCitySpace returns undefined on an empty board', () => {
    cast(tilePlacer.findExpeditedConstructionCitySpace(), undefined);
  });

  it('findExpeditedConstructionCitySpace returns undefined when only one greenery is adjacent', () => {
    game.simpleAddTile(human, inlandSpace(), {tileType: TileType.GREENERY});

    cast(tilePlacer.findExpeditedConstructionCitySpace(), undefined);
  });

  it('findExpeditedConstructionCitySpace finds the space next to two greeneries', () => {
    const [first, second] = game.board.getAdjacentSpaces(inlandSpace());
    game.simpleAddTile(human, first, {tileType: TileType.GREENERY});
    game.simpleAddTile(human, second, {tileType: TileType.GREENERY});

    const space = tilePlacer.findExpeditedConstructionCitySpace()!;

    const adjacent = game.board.getAdjacentSpaces(space).map(toID);
    expect(adjacent).to.include.members([first.id, second.id]);
  });

  it('findExpeditedConstructionCitySpace picks among the eligible spaces by the usual city rule', () => {
    // 12 is next to three oceans and 47 to two greeneries. Both qualify, and then the city goes where
    // the most greeneries are.
    for (const id of ['06', '07', '13'] as const) {
      game.simpleAddTile(human, game.board.getSpaceOrThrow(id), {tileType: TileType.OCEAN});
    }
    for (const id of ['39', '54'] as const) {
      game.simpleAddTile(human, game.board.getSpaceOrThrow(id), {tileType: TileType.GREENERY});
    }

    expect(tilePlacer.findExpeditedConstructionCitySpace()?.id).to.eq('47');
  });

  it('findNeuralInstanceSpace avoids the spaces next to the one reserved for Noctis City', () => {
    // 30 and 39 border Noctis City and cover two bonus icons each, more than any space the
    // tile may go on, so the tiebreakers alone would choose one of them.
    const noctisCity = game.board.getSpaceOrThrow(SpaceName.NOCTIS_CITY);
    const bordering = game.board.getAdjacentSpaces(noctisCity);
    for (const id of ['30', '39'] as const) {
      expect(bordering.map(toID), id).to.include(id);
      expect(game.board.getSpaceOrThrow(id).bonus, id).has.length(2);
    }

    const space = tilePlacer.findNeuralInstanceSpace()!;

    expect(bordering.map(toID)).to.not.include(space.id);
  });

  it('breaks ties on ocean adjacency first, then on bonus icons', () => {
    // MarsBot owns no tiles, so every land space is a greenery candidate and they all
    // score 0 on city adjacency. That leaves the tiebreakers to decide. Covering 03 leaves
    // 09 as the richest of the three spaces still free next to the ocean.
    game.simpleAddTile(human, game.board.getSpaceOrThrow('04'), {tileType: TileType.OCEAN});
    game.simpleAddTile(human, game.board.getSpaceOrThrow('03'), {tileType: TileType.GREENERY});

    const space = tilePlacer.findGreenerySpace()!;

    expect(space.id).to.eq('09');
    expect(space.bonus).deep.eq([SpaceBonus.STEEL]);
    // 09 is the only one of the three spaces still free next to the ocean that has a bonus at all.
    const adjacentOceans = game.board.getAvailableSpacesOnLand(marsBot)
      .filter((s) => game.board.getAdjacentSpaces(s).some((a) => a.tile?.tileType === TileType.OCEAN));
    expect(adjacentOceans.map(toID)).deep.eq(['05', '09', '10']);
    // Spaces covering two bonus icons are available, they just aren't next to an ocean.
    expect(Math.max(...game.board.getAvailableSpacesOnLand(marsBot).map((s) => s.bonus.length))).to.eq(2);
  });

  it('draws and discards one project card when spaces are still tied', () => {
    game.projectDeck.discardPile.length = 0;

    tilePlacer.findOceanSpace();

    expect(game.projectDeck.discardPile).has.length(1);
  });

  it('counts through the tied spaces from the first one', () => {
    // With every other ocean space covered, 04 and 28 tie: no ocean next to either and two bonus icons each.
    for (const space of game.board.getAvailableSpacesForOcean(marsBot)) {
      if (space.id !== '04' && space.id !== '28') {
        game.simpleAddTile(human, space, {tileType: TileType.OCEAN});
      }
    }

    const runs = [
      {cost: 1, expected: '04'},
      {cost: 2, expected: '28'},
      {cost: 3, expected: '04'},
      {cost: 0, expected: '28'},
    ];
    for (const run of runs) {
      game.projectDeck.drawPile.push(fakeCard({cost: run.cost}));

      expect(tilePlacer.findOceanSpace()?.id, `cost ${run.cost}`).eq(run.expected);
    }
  });

  it('getPlacementBonusMC pays 1 M€ per bonus icon covered', () => {
    const space = game.board.getSpaceOrThrow('03');
    expect(space.bonus).deep.eq([SpaceBonus.STEEL, SpaceBonus.STEEL]);

    expect(tilePlacer.getPlacementBonusMC(space)).to.eq(2);
  });

  it('getPlacementBonusMC pays nothing for a space without bonus icons', () => {
    const space = game.board.getSpaceOrThrow('05');
    expect(space.bonus).is.empty;

    expect(tilePlacer.getPlacementBonusMC(space)).to.eq(0);
  });

  it('getOceanAdjacencyMC pays 2 M€ per adjacent ocean', () => {
    game.simpleAddTile(marsBot, game.board.getSpaceOrThrow('04'), {tileType: TileType.OCEAN});
    const neighbour = game.board.getSpaceOrThrow('05');

    expect(tilePlacer.getOceanAdjacencyMC(neighbour)).to.eq(2);
  });

  it('getOceanAdjacencyMC pays nothing next to an ocean-reserved space with no tile on it', () => {
    const neighbour = game.board.getSpaceOrThrow('05');
    const reserved = game.board.getAdjacentSpaces(neighbour).filter((s) => s.spaceType === SpaceType.OCEAN);
    expect(reserved.every((s) => s.tile === undefined)).is.true;

    expect(tilePlacer.getOceanAdjacencyMC(neighbour)).to.eq(0);
  });

  it('getTotalPlacementMC adds both parts together', () => {
    game.simpleAddTile(marsBot, game.board.getSpaceOrThrow('04'), {tileType: TileType.OCEAN});
    const neighbour = game.board.getSpaceOrThrow('03');
    expect(neighbour.bonus).deep.eq([SpaceBonus.STEEL, SpaceBonus.STEEL]);

    // 2 M€ for the two steel icons, 2 M€ for the one adjacent ocean.
    expect(tilePlacer.getTotalPlacementMC(neighbour)).to.eq(4);
  });

  type BotOptions = {
    megacredits?: number,
    /** The bot has no colony tile left to build on. */
    noColonyLeft?: boolean,
    /** The effect the placer asks of the bot does not happen. */
    swallows?: boolean,
  };

  type Run = {
    rule: string,
    options?: Partial<GameOptions>,
    milestones?: Array<IMilestone>,
    awards?: Array<IAward>,
    oceans?: ReadonlyArray<SpaceId>,
    specialTile?: SpaceId,
    bot?: BotOptions,
    /** Runs on the new game before MarsBot chooses. */
    before?: () => void,
    winner: SpaceId,
    loser: SpaceId,
  };

  /**
   * Starts a game with a placer whose bot has the M€ in `bot`, and notes in `calls` the hex effects
   * it is asked for. The bot carries them out on the game.
   */
  function startGame(options: Partial<GameOptions> | undefined, bot: BotOptions = {}, calls: Array<string> = []) {
    [game, human, marsBot] = testGame(2, options);
    // The board only offers the special hexes to a player who can pay for them.
    marsBot.megaCredits = 20;
    const fake = fakeMarsBot(undefined, {
      megacredits: bot.megacredits ?? 0,
      placeOcean: () => {
        calls.push('ocean');
        if (bot.swallows !== true) {
          game.addOcean(marsBot, game.board.getAvailableSpacesForOcean(marsBot)[0]);
        }
      },
      raiseTemperature: () => {
        calls.push('temperature');
        if (bot.swallows !== true) {
          game.increaseTemperature(marsBot, 1);
        }
      },
      maybePlaceRandomColony: () => {
        calls.push('colony');
        return bot.swallows !== true;
      },
      canPlaceColony: () => bot.noColonyLeft !== true,
    });
    tilePlacer = new MarsBotTilePlacer(game, marsBot, human, fake);
    return fake;
  }

  /**
   * Plays out a run on a fresh game and expects MarsBot's city to go on its `winner` rather than
   * its `loser`, with no flipped card needed to decide.
   */
  function expectWinner(run: Run): void {
    startGame(run.options, run.bot);
    // Keep the game's own milestones and awards out of the comparison.
    game.milestones = run.milestones ?? [];
    game.awards = run.awards ?? [];
    for (const id of run.oceans ?? []) {
      game.simpleAddTile(human, game.board.getSpaceOrThrow(id), {tileType: TileType.OCEAN});
    }
    if (run.specialTile !== undefined) {
      game.simpleAddTile(human, game.board.getSpaceOrThrow(run.specialTile), {tileType: TileType.NATURAL_PRESERVE});
    }
    run.before?.();
    game.projectDeck.discardPile.length = 0;

    const space = tilePlacer.findCitySpace((s) => s.id === run.winner || s.id === run.loser);

    expect(space?.id, run.rule).eq(run.winner);
    expect(game.projectDeck.discardPile, run.rule).is.empty;
  }

  it('breaks ties by the order of each map\'s tiebreakers', () => {
    const runs: Array<Run> = [
      {
        // 63 is polar and has no icons, 24 is not polar and has two.
        rule: 'Hellas: the polar region comes before reward icons',
        options: {boardName: BoardName.HELLAS},
        winner: '63',
        loser: '24',
      },
      {
        // 54 is on the second row from the bottom, 49 on the third. Both have one icon.
        rule: 'Hellas: the polar region starts on the second row from the bottom',
        options: {boardName: BoardName.HELLAS},
        winner: '54',
        loser: '49',
      },
      {
        // 39 is on the fourth row from the bottom, which is southern, and 22 is not. Both have one icon.
        rule: 'Elysium: the southern region breaks a tie on reward icons',
        options: {boardName: BoardName.ELYSIUM},
        winner: '39',
        loser: '22',
      },
      {
        // The tile is on 17. 10 is next to it and has no icons, 12 is not and has two.
        rule: 'Terra Cimmeria: a space next to a special tile comes before reward icons',
        options: {boardName: BoardName.TERRA_CIMMERIA_NOVA},
        specialTile: '17',
        winner: '10',
        loser: '12',
      },
      {
        // 28 is on the edge, 16 is not. Both have one icon.
        rule: 'Utopia Planitia: an edge space counts as one more reward icon',
        options: {boardName: BoardName.UTOPIA_PLANITIA},
        winner: '28',
        loser: '16',
      },
      {
        // 12 is next to the volcano on 13, 18 is not near one. Both are inland and have one icon.
        rule: 'Vastitas Borealis: a volcanic space and the spaces next to it count as one more reward icon',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        winner: '12',
        loser: '18',
      },
      {
        // The ocean is on 16. 32 has two icons and no ocean next to it, 24 has one icon and is next to the ocean.
        rule: 'Vastitas Borealis: reward icons come before ocean adjacency',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        oceans: ['16'],
        winner: '32',
        loser: '24',
      },
      {
        // The ocean is on 16. 03 is on the edge with no ocean next to it, 24 is inland and next to the ocean. Both have one icon.
        rule: 'Vastitas Borealis: an edge space comes before ocean adjacency',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        oceans: ['16'],
        winner: '03',
        loser: '24',
      },
      {
        // The ocean is on 15. 08 is next to it, 37 is not. Both are on the edge and have two icons.
        rule: 'Vastitas Borealis: ocean adjacency breaks a tie between edge spaces',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        oceans: ['15'],
        winner: '08',
        loser: '37',
      },
      {
        // 03 has one icon. 28 has only the delegate icon. Both are on the edge.
        rule: 'Vastitas Borealis: without Turmoil the delegate hex counts no reward icon',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        winner: '03',
        loser: '28',
      },
      {
        // 28 has the delegate icon, 60 has no icons. Both are on the edge.
        rule: 'Vastitas Borealis: with Turmoil the delegate hex counts a reward icon',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA, turmoilExtension: true},
        winner: '28',
        loser: '60',
      },
      {
        // The ocean is on 16. 24 has one icon and is next to it, 32 has two icons and is not.
        rule: 'Milestones & Awards: any map plays by the Tharsis tiebreakers',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA, modularMA: true},
        oceans: ['16'],
        winner: '24',
        loser: '32',
      },
    ];

    for (const run of runs) {
      expectWinner(run);
    }
  });

  it('counts what the milestones and awards in play add as one more reward icon', () => {
    const runs: Array<Run> = [
      // 09 is a volcanic space, 23 is not near one. Both have one icon.
      {rule: 'Geologist: volcanic spaces and the spaces next to them', milestones: [new Geologist()], winner: '09', loser: '23'},
      // The tile is on 17. 24 is next to it, 23 is not. Both have one icon.
      {rule: 'Founder: spaces next to a special tile', awards: [new Founder()], specialTile: '17', winner: '24', loser: '23'},
      // 20 is on the edge, 23 is not. Both have one icon.
      {rule: 'Suburbian: edge spaces', awards: [new Suburbian()], winner: '20', loser: '23'},
    ];

    for (const run of runs) {
      expectWinner(run);
    }
  });

  it('puts ocean adjacency after the reward icons with the Highlander award in play', () => {
    const runs: Array<Run> = [
      {
        // The ocean is on 04. 25 has two icons and no ocean next to it, 09 has one icon and is next to the ocean.
        rule: 'Tharsis: reward icons come before ocean adjacency',
        awards: [new Highlander()],
        oceans: ['04'],
        winner: '25',
        loser: '09',
      },
      {
        // The ocean is on 24. 16 is next to it, 39 is not but is southern. Both have one icon.
        rule: 'Elysium: ocean adjacency still comes before the southern region',
        options: {boardName: BoardName.ELYSIUM},
        awards: [new Highlander()],
        oceans: ['24'],
        winner: '16',
        loser: '39',
      },
      {
        // The ocean is on 16. 03 is on the edge with no ocean next to it, 24 is inland and next to the ocean. Both have one icon.
        rule: 'Vastitas Borealis: ocean adjacency stays after the edge',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        awards: [new Highlander()],
        oceans: ['16'],
        winner: '03',
        loser: '24',
      },
    ];

    for (const run of runs) {
      expectWinner(run);
    }
  });

  it('offers MarsBot the hexes that cost M€ even when it cannot pay, but not the human', () => {
    const runs: Array<{rule: string, options: Partial<GameOptions>, hex: SpaceId}> = [
      {rule: 'South Pole', options: {boardName: BoardName.HELLAS}, hex: '61'},
      {rule: 'North Pole', options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA}, hex: '33'},
      {rule: 'MSL Curiosity', options: {boardName: BoardName.TERRA_CIMMERIA_NOVA, coloniesExtension: true}, hex: '16'},
    ];

    for (const run of runs) {
      const [soloGame, soloHuman] = testGame(1, {...run.options, automa: true});
      const bot = soloGame.marsBotPlayer!;
      soloHuman.megaCredits = 0;
      bot.megaCredits = 0;
      // No colony tile has room, so nobody could settle for MSL Curiosity.
      for (const colony of soloGame.colonies) {
        colony.isActive = false;
      }

      const botSpaces = soloGame.board.getAvailableSpacesOnLand(bot).map((space) => space.id);
      const humanSpaces = soloGame.board.getAvailableSpacesOnLand(soloHuman).map((space) => space.id);

      expect(botSpaces, run.rule).includes(run.hex);
      expect(humanSpaces, run.rule).does.not.include(run.hex);
    }
  });

  it('tiebreaks on a hex that costs M€ by what MarsBot can get from it', () => {
    const runs: Array<Run> = [
      {
        // 61 is the South Pole. 55 is polar too and has two icons.
        rule: 'South Pole: with 6 M€ and an ocean to place it beats a space with two icons',
        options: {boardName: BoardName.HELLAS},
        bot: {megacredits: 6},
        winner: '61',
        loser: '55',
      },
      {
        rule: 'South Pole: with 5 M€ it counts as a space without rewards',
        options: {boardName: BoardName.HELLAS},
        bot: {megacredits: 5},
        winner: '55',
        loser: '61',
      },
      {
        rule: 'South Pole: with every ocean placed it counts as a space without rewards',
        options: {boardName: BoardName.HELLAS},
        bot: {megacredits: 20},
        before: () => maxOutOceans(human),
        winner: '55',
        loser: '61',
      },
      {
        // 33 is the North Pole. 32 is inland too and has two icons.
        rule: 'North Pole: with 4 M€ and a temperature to raise it beats a space with two icons',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        bot: {megacredits: 4},
        winner: '33',
        loser: '32',
      },
      {
        rule: 'North Pole: with 3 M€ it counts as a space without rewards',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        bot: {megacredits: 3},
        winner: '32',
        loser: '33',
      },
      {
        rule: 'North Pole: with the temperature maxed it counts as a space without rewards',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        bot: {megacredits: 20},
        before: () => setTemperature(game, game.max.temperature),
        winner: '32',
        loser: '33',
      },
      {
        // 16 is MSL Curiosity. 25 has two icons and 40 has three.
        rule: 'MSL Curiosity: with 5 M€ and a colony to place it beats a space with two icons',
        options: {boardName: BoardName.TERRA_CIMMERIA_NOVA, coloniesExtension: true},
        bot: {megacredits: 5},
        winner: '16',
        loser: '25',
      },
      {
        rule: 'MSL Curiosity: it does not beat a space with three icons',
        options: {boardName: BoardName.TERRA_CIMMERIA_NOVA, coloniesExtension: true},
        bot: {megacredits: 5},
        winner: '40',
        loser: '16',
      },
      {
        rule: 'MSL Curiosity: with 4 M€ it counts as a space without rewards',
        options: {boardName: BoardName.TERRA_CIMMERIA_NOVA, coloniesExtension: true},
        bot: {megacredits: 4},
        winner: '25',
        loser: '16',
      },
      {
        rule: 'MSL Curiosity: with no colony left it counts as a space without rewards',
        options: {boardName: BoardName.TERRA_CIMMERIA_NOVA, coloniesExtension: true},
        bot: {megacredits: 20, noColonyLeft: true},
        winner: '25',
        loser: '16',
      },
    ];

    for (const run of runs) {
      expectWinner(run);
    }
  });

  it('resolves a hex that costs M€ and pays only for what happened', () => {
    type HexRun = {
      rule: string,
      options: Partial<GameOptions>,
      hex: SpaceId,
      bot: BotOptions,
      calls: Array<string>,
      /** The bot's M€ afterwards. */
      left: number,
      /** The M€ MarsBot gets for the icons on the hex. */
      pays?: number,
    };
    const runs: Array<HexRun> = [
      {
        rule: 'South Pole: places an ocean and costs 6 M€',
        options: {boardName: BoardName.HELLAS},
        hex: '61',
        bot: {megacredits: 10},
        calls: ['ocean'],
        left: 4,
      },
      {
        rule: 'South Pole: does nothing with 5 M€',
        options: {boardName: BoardName.HELLAS},
        hex: '61',
        bot: {megacredits: 5},
        calls: [],
        left: 5,
      },
      {
        rule: 'South Pole: costs nothing when no ocean is placed',
        options: {boardName: BoardName.HELLAS},
        hex: '61',
        bot: {megacredits: 10, swallows: true},
        calls: ['ocean'],
        left: 10,
      },
      {
        rule: 'North Pole: raises the temperature and costs 4 M€',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        hex: '33',
        bot: {megacredits: 6},
        calls: ['temperature'],
        left: 2,
      },
      {
        rule: 'North Pole: costs nothing when the temperature does not rise',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        hex: '33',
        bot: {megacredits: 6, swallows: true},
        calls: ['temperature'],
        left: 6,
      },
      {
        rule: 'MSL Curiosity: places a colony and costs 5 M€',
        options: {boardName: BoardName.TERRA_CIMMERIA_NOVA, coloniesExtension: true},
        hex: '16',
        bot: {megacredits: 7},
        calls: ['colony'],
        left: 2,
      },
      {
        rule: 'MSL Curiosity: costs nothing when no colony is placed',
        options: {boardName: BoardName.TERRA_CIMMERIA_NOVA, coloniesExtension: true},
        hex: '16',
        bot: {megacredits: 7, swallows: true},
        calls: ['colony'],
        left: 7,
      },
      {
        rule: 'Viking: gives 1 M€ for its delegate icon with Turmoil',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA, turmoilExtension: true},
        hex: '28',
        bot: {megacredits: 3},
        calls: [],
        left: 3,
        pays: 1,
      },
      {
        rule: 'Viking: gives nothing without Turmoil',
        options: {boardName: BoardName.VASTITAS_BOREALIS_NOVA},
        hex: '28',
        bot: {megacredits: 3},
        calls: [],
        left: 3,
      },
    ];

    for (const run of runs) {
      const calls: Array<string> = [];
      const bot = startGame(run.options, run.bot, calls);
      const space = game.board.getSpaceOrThrow(run.hex);

      tilePlacer.resolveSpecialHex(space);

      expect(calls, run.rule).deep.eq(run.calls);
      expect(bot.megacredits, run.rule).eq(run.left);
      expect(tilePlacer.getPlacementBonusMC(space), run.rule).eq(run.pays ?? 0);
    }
  });
});
