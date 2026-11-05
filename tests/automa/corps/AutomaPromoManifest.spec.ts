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

/** A bot that records the corp handlers' calls, in order, as `name(arguments)`. `botPlayer` owns MarsBot's tiles. */
type RecordingBot = {bot: IMarsBot, calls: Array<string>, corpState: Map<string, number>, botPlayer: TestPlayer, human: TestPlayer};

function recordingBot(): RecordingBot {
  const [game, human, botPlayer] = testGame(2);
  const calls: Array<string> = [];
  const corpState = new Map<string, number>();
  const bot: IMarsBot = fakeMarsBot(THARSIS_MARSBOT_BOARD, {
    game,
    player: botPlayer,
    humanPlayer: human,
    megacredits: 0,
    gainMc: (amount) => calls.push(`gainMc(${amount})`),
    raiseTR: (steps) => calls.push(`raiseTR(${steps})`),
    advanceTrack: (trackIndex) => {
      calls.push(`advanceTrack(${trackIndex})`);
      bot.marsBotBoard.tracks[trackIndex].position++;
    },
    placeGreenery: () => calls.push('placeGreenery()'),
    removeBonusCard: (id) => calls.push(`removeBonusCard(${id})`),
    resolveBonusCard: (id) => calls.push(`resolveBonusCard(${id})`),
    addBonusCardToBonusDeck: (id) => calls.push(`addBonusCardToBonusDeck(${id})`),
    addProjectCardsToBonusDeck: (tag, count) => calls.push(`addProjectCardsToBonusDeck(${tag}, ${count})`),
    getCorpState: (key) => corpState.get(key) ?? 0,
    setCorpState: (key, value) => corpState.set(key, value),
  });
  return {bot, calls, corpState, botPlayer, human};
}

const corp = (name: CardName): IMarsBotCorp => AUTOMA_PROMO_MANIFEST.corps[name]!;

/** Puts `others` tiles of the other side and `own` of the placer's around an empty space, puts a tile on it and runs Philares. */
function placeTile({bot, botPlayer, human}: RecordingBot, byMarsBot: boolean, tileType: TileType, others: number, own: number = 0): void {
  const [placer, other] = byMarsBot ? [botPlayer, human] : [human, botPlayer];
  const board = bot.game.board;
  const space = board.getAvailableSpacesOnLand(placer).find((s) => {
    const adjacent = board.getAdjacentSpaces(s);
    return adjacent.length === 6 && adjacent.every((a) => a.spaceType === SpaceType.LAND && a.tile === undefined);
  })!;
  board.getAdjacentSpaces(space).slice(0, others + own).forEach((s, i) => {
    bot.game.simpleAddTile(i < others ? other : placer, s, {tileType: TileType.GREENERY});
  });
  bot.game.simpleAddTile(placer, space, {tileType});

  corp(CardName.PHILARES).effect!.onTilePlaced!(bot, byMarsBot, tileType, space);
}

describe('AutomaPromoManifest', () => {
  // C21: the Setup box (rulebook B p.1). A microbe card the player plays costs it 4 M€, a Prelude's too (rulebook B p.4)
  it('Pharmacy Union swaps Meteor Shower for a science card, raises its TR for science cards, and loses 4 M€ for the microbe cards the player plays', () => {
    const {bot, calls} = recordingBot();
    const pharmacy = corp(CardName.PHARMACY_UNION);
    bot.megacredits = 6;

    pharmacy.setup!(bot);
    pharmacy.effect!.onProjectCardResolved!(bot, new SearchForLife());
    pharmacy.effect!.onProjectCardResolved!(bot, new Asteroid());
    expect(calls).deep.eq(['removeBonusCard(B01)', 'addProjectCardsToBonusDeck(science, 1)', 'raiseTR(1)']);

    for (const [card, megacredits] of [[new Asteroid(), 6], [new ArchaeBacteria(), 2], [new ArchaeBacteria(), 0]] as const) {
      pharmacy.effect!.onHumanCardPlayed!(bot, card);
      expect(bot.megacredits).eq(megacredits);
    }
  });

  it('Philares places a greenery, resolves Local Neural Instance and starts with one science resource', () => {
    const {bot, calls, corpState} = recordingBot();

    corp(CardName.PHILARES).setup!(bot);

    expect(calls).deep.eq(['placeGreenery()', 'removeBonusCard(B07)', 'resolveBonusCard(B07)', 'addBonusCardToBonusDeck(B27)']);
    expect(corpState.get('scienceResources')).eq(1);
  });

  // C22: each adjacency between the two sides' tiles, whoever just placed the tile
  for (const byMarsBot of [true, false]) {
    it(`Philares gains a science resource for each of the other side's tiles that a tile placed by ${byMarsBot ? 'MarsBot' : 'the player'} touches`, () => {
      const rb = recordingBot();

      placeTile(rb, byMarsBot, TileType.CITY, 2, 1);

      expect(rb.corpState.get('scienceResources')).eq(2);
    });
  }

  it('Philares spends 4 science resources per advance of its most-advanced track that is not maxed, but not for oceans or after the game has ended', () => {
    const rb = recordingBot();
    const {bot, calls, corpState} = rb;
    bot.marsBotBoard.tracks[0].position = bot.marsBotBoard.tracks[0].definition.layout.length - 1;
    bot.marsBotBoard.tracks[1].position = 10;

    placeTile(rb, true, TileType.OCEAN, 1);
    expect(corpState.get('scienceResources')).is.undefined;

    corpState.set('scienceResources', 7);
    placeTile(rb, true, TileType.CITY, 1);
    expect(calls).deep.eq(['advanceTrack(1)', 'advanceTrack(1)']);
    expect(corpState.get('scienceResources')).eq(0);

    // Nothing advances after the game has ended (BGG 3513998)
    bot.game.phase = Phase.END;
    corpState.set('scienceResources', 3);
    placeTile(rb, true, TileType.CITY, 1);
    expect(calls).has.length(2);
    expect(corpState.get('scienceResources')).eq(4);
  });

  // C23: the cubes on the building track (rulebook B p.3)
  it('Recyclon advances the plant track for the white cubes on spaces 3, 6, 9, 12, 15 and 18 of the building track', () => {
    const {bot, calls} = recordingBot();
    const recyclon = corp(CardName.RECYCLON);
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);

    recyclon.effect!.onTrackCubeTrigger!(bot, 0, 3, 'white');

    expect(corpTrackCubes(recyclon, board).map((cube) => `${board.definitions[cube.trackIndex].tags[0]} ${cube.cubeType} ${cube.position}`))
      .deep.eq([3, 6, 9, 12, 15, 18].map((position) => `building white ${position}`));
    expect(board.definitions[6].tags).includes(Tag.PLANT);
    expect(calls).deep.eq(['advanceTrack(6)']);
  });

  // C24: the Setup box (rulebook B p.1). A microbe card the player plays, a Prelude's too (rulebook B p.4)
  it('Splice gains 8 M€ at setup, 4 M€ for its own microbe cards, and 2 M€ plus 2 M€ for the player for a microbe card that holds no microbes', () => {
    const {bot, calls, human} = recordingBot();
    const splice = corp(CardName.SPLICE);

    splice.setup!(bot);
    splice.effect!.onProjectCardResolved!(bot, new Asteroid());
    splice.effect!.onProjectCardResolved!(bot, new ArchaeBacteria());
    splice.effect!.onHumanCardPlayed!(bot, new Asteroid());
    splice.effect!.onHumanCardPlayed!(bot, new ArchaeBacteria());

    expect(calls).deep.eq(['gainMc(8)', 'removeBonusCard(B03)', 'addProjectCardsToBonusDeck(microbe, 1)', 'gainMc(4)', 'gainMc(2)']);
    expect(human.stock.megacredits).eq(2);
  });

  it('Splice lets the player add a microbe to a microbe card they played instead of gaining 2 M€', () => {
    const {bot, calls, human} = recordingBot();
    const card = new Decomposers();

    corp(CardName.SPLICE).effect!.onHumanCardPlayed!(bot, card);
    runAllActions(bot.game);
    const orOptions = cast(human.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.length(2);
    orOptions.options[0].cb();

    expect(calls).deep.eq(['gainMc(2)']);
    expect(card.resourceCount).eq(1);
    expect(human.stock.megacredits).eq(0);
  });
});
