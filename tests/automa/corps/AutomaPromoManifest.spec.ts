import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {fakeMarsBot} from '../FakeMarsBot';
import {Phase} from '../../../src/common/Phase';
import {CardName} from '../../../src/common/cards/CardName';
import {Tag} from '../../../src/common/cards/Tag';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {cast} from '../../../src/common/utils/utils';
import {IGame} from '../../../src/server/IGame';
import {IPlayer} from '../../../src/server/IPlayer';
import {Space} from '../../../src/server/boards/Space';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {IMarsBot} from '../../../src/server/automa/IMarsBot';
import {IMarsBotCorp} from '../../../src/server/automa/IMarsBotCorp';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';
import {corpTrackCubes} from '../../../src/server/automa/corpTrackCubes';
import {AUTOMA_PROMO_MANIFEST} from '../../../src/server/automa/corps/AutomaPromoManifest';
import {ArchaeBacteria} from '../../../src/server/cards/base/ArchaeBacteria';
import {Asteroid} from '../../../src/server/cards/base/Asteroid';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';

type RecordingBot = {
  bot: IMarsBot;
  /** The corp handlers' calls into the bot, in order, as `name(arguments)`. */
  calls: Array<string>;
  corpState: Map<string, number>;
  /** The player MarsBot's tiles belong to. */
  botPlayer: IPlayer;
  human: TestPlayer;
};

function recordingBot(): RecordingBot {
  const [game, human, botPlayer] = testGame(2);
  const calls: Array<string> = [];
  const corpState = new Map<string, number>();
  const record = (call: string) => {
    calls.push(call);
  };
  const bot: IMarsBot = fakeMarsBot(THARSIS_MARSBOT_BOARD, {
    game,
    player: botPlayer,
    humanPlayer: human,
    megacredits: 0,
    gainMc: (amount) => record(`gainMc(${amount})`),
    raiseTR: (steps) => record(`raiseTR(${steps})`),
    advanceTrack: (trackIndex) => {
      record(`advanceTrack(${trackIndex})`);
      bot.marsBotBoard.tracks[trackIndex].position++;
    },
    placeGreenery: () => record('placeGreenery()'),
    removeBonusCard: (id) => record(`removeBonusCard(${id})`),
    resolveBonusCard: (id) => record(`resolveBonusCard(${id})`),
    addBonusCardToBonusDeck: (id) => record(`addBonusCardToBonusDeck(${id})`),
    addProjectCardsToBonusDeck: (tag, count) => record(`addProjectCardsToBonusDeck(${tag}, ${count})`),
    getCorpState: (key) => corpState.get(key) ?? 0,
    setCorpState: (key, value) => {
      corpState.set(key, value);
    },
  });
  return {bot, calls, corpState, botPlayer, human};
}

function corp(name: CardName): IMarsBotCorp {
  const found = AUTOMA_PROMO_MANIFEST.corps[name];
  if (found === undefined) {
    throw new Error(`${name} is not in the Promo manifest`);
  }
  return found;
}

/** An empty land space whose six neighbours are land too. */
function quietSpace(game: IGame, player: IPlayer): Space {
  const board = game.board;
  return board.getAvailableSpacesOnLand(player).find((space) => {
    const adjacent = board.getAdjacentSpaces(space);
    return adjacent.length === 6 && adjacent.every((s) => s.spaceType === SpaceType.LAND);
  })!;
}

describe('AutomaPromoManifest', () => {
  it('keys each of the four corporations by its own name', () => {
    const entries = Object.entries(AUTOMA_PROMO_MANIFEST.corps);

    expect(entries).to.have.length(4);
    for (const [name, found] of entries) {
      expect(found.name).eq(name);
    }
  });

  // The Setup boxes (C21, C22, C24)
  for (const run of [
    {
      name: CardName.PHARMACY_UNION,
      calls: ['removeBonusCard(B01)', 'addProjectCardsToBonusDeck(science, 1)'],
      corpState: {},
    },
    {
      name: CardName.PHILARES,
      calls: ['placeGreenery()', 'removeBonusCard(B07)', 'resolveBonusCard(B07)', 'addBonusCardToBonusDeck(B27)'],
      corpState: {scienceResources: 1},
    },
    {
      name: CardName.SPLICE,
      calls: ['gainMc(8)', 'removeBonusCard(B03)', 'addProjectCardsToBonusDeck(microbe, 1)'],
      corpState: {},
    },
  ]) {
    it(`${run.name} setup: ${run.calls.join(', ')}`, () => {
      const {bot, calls, corpState} = recordingBot();

      corp(run.name).setup!(bot);

      expect(calls).deep.eq(run.calls);
      expect(Object.fromEntries(corpState)).deep.eq(run.corpState);
    });
  }

  // C21
  it('Pharmacy Union raises its TR for a science card, and for no other', () => {
    const {bot, calls} = recordingBot();
    const effect = corp(CardName.PHARMACY_UNION).effect!;

    effect.onProjectCardResolved!(bot, new SearchForLife());
    effect.onProjectCardResolved!(bot, new Asteroid());

    expect(calls).deep.eq(['raiseTR(1)']);
  });

  it('Pharmacy Union loses 4 M€ when the player plays a microbe card, as much as it can lose', () => {
    const {bot} = recordingBot();
    const onHumanCardPlayed = corp(CardName.PHARMACY_UNION).effect!.onHumanCardPlayed!;
    bot.megacredits = 6;

    onHumanCardPlayed(bot, new Asteroid());
    expect(bot.megacredits).eq(6);

    onHumanCardPlayed(bot, new ArchaeBacteria());
    expect(bot.megacredits).eq(2);

    onHumanCardPlayed(bot, new ArchaeBacteria());
    expect(bot.megacredits).eq(0);
  });

  // C22: tile placers, with the tiles that touch
  for (const run of [
    {placer: 'MarsBot', placedByMarsBot: true},
    {placer: 'the player', placedByMarsBot: false},
  ]) {
    it(`Philares gains a science resource for each of the other side's tiles that a tile placed by ${run.placer} touches`, () => {
      const {bot, corpState, botPlayer, human} = recordingBot();
      const [placer, other] = run.placedByMarsBot ? [botPlayer, human] : [human, botPlayer];
      const space = quietSpace(bot.game, placer);
      const [first, second, third] = bot.game.board.getAdjacentSpaces(space);
      bot.game.simpleAddTile(other, first, {tileType: TileType.GREENERY});
      bot.game.simpleAddTile(other, second, {tileType: TileType.GREENERY});
      bot.game.simpleAddTile(placer, third, {tileType: TileType.GREENERY});
      bot.game.simpleAddTile(placer, space, {tileType: TileType.CITY});

      corp(CardName.PHILARES).effect!.onTilePlaced!(bot, run.placedByMarsBot, TileType.CITY, space);

      expect(corpState.get('scienceResources')).eq(2);
    });
  }

  it('Philares gains nothing from an ocean, which belongs to no one', () => {
    const {bot, corpState, botPlayer, human} = recordingBot();
    const space = quietSpace(bot.game, botPlayer);
    bot.game.simpleAddTile(human, bot.game.board.getAdjacentSpaces(space)[0], {tileType: TileType.GREENERY});
    bot.game.simpleAddTile(botPlayer, space, {tileType: TileType.OCEAN});

    corp(CardName.PHILARES).effect!.onTilePlaced!(bot, true, TileType.OCEAN, space);

    expect(corpState.get('scienceResources')).is.undefined;
  });

  it('Philares spends 4 science resources for each advance of its most-advanced track that is not maxed', () => {
    const {bot, calls, corpState, botPlayer, human} = recordingBot();
    const tracks = bot.marsBotBoard.tracks;
    tracks[0].position = tracks[0].definition.layout.length - 1;
    tracks[1].position = 10;
    corpState.set('scienceResources', 7);
    const space = quietSpace(bot.game, botPlayer);
    bot.game.simpleAddTile(human, bot.game.board.getAdjacentSpaces(space)[0], {tileType: TileType.GREENERY});
    bot.game.simpleAddTile(botPlayer, space, {tileType: TileType.CITY});

    corp(CardName.PHILARES).effect!.onTilePlaced!(bot, true, TileType.CITY, space);

    expect(calls).deep.eq(['advanceTrack(1)', 'advanceTrack(1)']);
    expect(corpState.get('scienceResources')).eq(0);
  });

  // The BGG ruling, TDaver 3513998
  it('Philares keeps its science resources once the game has ended', () => {
    const {bot, calls, corpState, botPlayer, human} = recordingBot();
    bot.game.phase = Phase.END;
    corpState.set('scienceResources', 3);
    const space = quietSpace(bot.game, botPlayer);
    bot.game.simpleAddTile(human, bot.game.board.getAdjacentSpaces(space)[0], {tileType: TileType.GREENERY});
    bot.game.simpleAddTile(botPlayer, space, {tileType: TileType.CITY});

    corp(CardName.PHILARES).effect!.onTilePlaced!(bot, true, TileType.CITY, space);

    expect(calls).is.empty;
    expect(corpState.get('scienceResources')).eq(4);
  });

  // C23
  it('Recyclon places white cubes on spaces 3, 6, 9, 12, 15 and 18 of the building track', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);

    const placed = corpTrackCubes(corp(CardName.RECYCLON), board)
      .map((cube) => `${board.definitions[cube.trackIndex].tags[0]} ${cube.cubeType} ${cube.position}`);

    expect(placed).deep.eq([3, 6, 9, 12, 15, 18].map((position) => `building white ${position}`));
  });

  it('Recyclon advances the plant track when a white cube on the building track triggers', () => {
    const {bot, calls} = recordingBot();
    expect(bot.marsBotBoard.definitions[6].tags).includes(Tag.PLANT);

    corp(CardName.RECYCLON).effect!.onTrackCubeTrigger!(bot, 0, 3, 'white');

    expect(calls).deep.eq(['advanceTrack(6)']);
  });

  // C24
  it('Splice gains 4 M€ for a microbe card, and for no other', () => {
    const {bot, calls} = recordingBot();
    const effect = corp(CardName.SPLICE).effect!;

    effect.onProjectCardResolved!(bot, new Asteroid());
    effect.onProjectCardResolved!(bot, new ArchaeBacteria());

    expect(calls).deep.eq(['gainMc(4)']);
  });

  it('Splice gains 2 M€ and gives the player 2 M€ for a microbe card that holds no microbes', () => {
    const {bot, calls, human} = recordingBot();
    const onHumanCardPlayed = corp(CardName.SPLICE).effect!.onHumanCardPlayed!;

    onHumanCardPlayed(bot, new Asteroid());
    expect(calls).is.empty;
    expect(human.stock.megacredits).eq(0);

    onHumanCardPlayed(bot, new ArchaeBacteria());
    expect(calls).deep.eq(['gainMc(2)']);
    expect(human.stock.megacredits).eq(2);
  });

  for (const run of [
    {choice: 0, microbes: 1, megacredits: 0},
    {choice: 1, microbes: 0, megacredits: 2},
  ]) {
    it(`Splice gains 2 M€ and lets the player choose 2 M€ or a microbe on the card played, option ${run.choice}`, () => {
      const {bot, calls, human} = recordingBot();
      const card = new Decomposers();

      corp(CardName.SPLICE).effect!.onHumanCardPlayed!(bot, card);
      runAllActions(bot.game);
      const orOptions = cast(human.popWaitingFor(), OrOptions);
      orOptions.options[run.choice].cb();

      expect(calls).deep.eq(['gainMc(2)']);
      expect(orOptions.options).has.length(2);
      expect(card.resourceCount).eq(run.microbes);
      expect(human.stock.megacredits).eq(run.megacredits);
    });
  }
});
