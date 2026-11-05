import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {fakeMarsBot} from '../FakeMarsBot';
import {Phase} from '../../../src/common/Phase';
import {CardName} from '../../../src/common/cards/CardName';
import {Tag} from '../../../src/common/cards/Tag';
import {TileType} from '../../../src/common/TileType';
import {BonusCardId, CubeType, TrackDefinition} from '../../../src/common/automa/AutomaTypes';
import {ACTION_DECK_BONUS_CARD_REMOVED, IMarsBotCorp} from '../../../src/server/automa/IMarsBotCorp';
import {IMarsBot} from '../../../src/server/automa/IMarsBot';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';
import {corpTrackCubes} from '../../../src/server/automa/corpTrackCubes';
import {AUTOMA_BASE_MANIFEST} from '../../../src/server/automa/corps/AutomaBaseManifest';
import {ArtificialLake} from '../../../src/server/cards/base/ArtificialLake';
import {Asteroid} from '../../../src/server/cards/base/Asteroid';
import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';
import {MagneticFieldGenerators} from '../../../src/server/cards/base/MagneticFieldGenerators';
import {LunarExports} from '../../../src/server/cards/colonies/LunarExports';

type RecordingBot = {
  bot: IMarsBot;
  /** The corp handlers' calls into the bot, in order, as `name(arguments)`. */
  calls: Array<string>;
  corpState: Map<string, number>;
};

type RecordingBotOptions = {
  board?: ReadonlyArray<TrackDefinition>;
  generation?: number;
  /** Runs after the fake `advanceTrack` moved the marker, for the M€ a real advance can earn. */
  onAdvance?: (trackIndex: number) => void;
};

function recordingBot(options: RecordingBotOptions = {}): RecordingBot {
  const [game] = testGame(1);
  game.generation = options.generation ?? 1;
  const calls: Array<string> = [];
  const corpState = new Map<string, number>();
  const record = (call: string) => {
    calls.push(call);
  };
  const bot: IMarsBot = fakeMarsBot(options.board ?? THARSIS_MARSBOT_BOARD, {
    game,
    gainMc: (amount) => record(`gainMc(${amount})`),
    advanceTrack: (trackIndex) => {
      record(`advanceTrack(${trackIndex})`);
      bot.marsBotBoard.tracks[trackIndex].position++;
      options.onAdvance?.(trackIndex);
    },
    raiseTemperature: (steps) => record(`raiseTemperature(${steps})`),
    placeCity: () => record('placeCity()'),
    removeBonusCard: (id) => record(`removeBonusCard(${id})`),
    addBonusCardToActionDeck: (id) => record(`addBonusCardToActionDeck(${id})`),
    addBonusCardToBonusDeck: (id) => record(`addBonusCardToBonusDeck(${id})`),
    addProjectCardsToBonusDeck: (tag, count) => record(`addProjectCardsToBonusDeck(${tag}, ${count})`),
    returnSetupBonusCardToBonusDeck: () => record('returnSetupBonusCardToBonusDeck()'),
    maybeMoveBonusCardToActionDeck: () => record('maybeMoveBonusCardToActionDeck()'),
    maybeDrawAndResolveProjectCard: () => record('maybeDrawAndResolveProjectCard()'),
    maybeDrawAndResolveProjectCardFirstTagOnly: () => record('maybeDrawAndResolveProjectCardFirstTagOnly()'),
    maybeDrawAndResolveBonusCard: () => record('maybeDrawAndResolveBonusCard()'),
    getCorpState: (key) => corpState.get(key) ?? 0,
    setCorpState: (key, value) => {
      corpState.set(key, value);
    },
  });
  return {bot, calls, corpState};
}

function corp(name: CardName): IMarsBotCorp {
  const found = AUTOMA_BASE_MANIFEST.corps[name];
  if (found === undefined) {
    throw new Error(`${name} is not in the base manifest`);
  }
  return found;
}

// Track indexes on the Tharsis board
const BUILDING = 0;
const SPACE = 1;
const EVENT = 2;
const POWER = 4;
const EARTH = 5;

const ALL_POSITIONS = Array.from({length: 18}, (_, i) => i + 1);

describe('AutomaBaseManifest', () => {
  it('keys each of the twelve corporations by its own name', () => {
    const entries = Object.entries(AUTOMA_BASE_MANIFEST.corps);

    expect(entries).to.have.length(12);
    for (const [name, found] of entries) {
      expect(found.name).eq(name);
    }
  });

  // The corporation cards name the tracks by tag, the cube lists name them by index.
  const cubes: Array<{name: CardName, cubes: Array<[Tag, CubeType, Array<number>]>, everyAdvance: boolean}> = [
    {
      name: CardName.HELION,
      cubes: [
        [Tag.BUILDING, 'white', [6]],
        [Tag.SPACE, 'white', [9]],
        [Tag.SCIENCE, 'white', [10]],
        [Tag.POWER, 'white', [5, 9]],
        [Tag.PLANT, 'white', [11]],
        [Tag.EARTH, 'black', [3, 6, 9, 12, 13, 14]],
      ],
      everyAdvance: false,
    },
    {
      name: CardName.INTERPLANETARY_CINEMATICS,
      cubes: [[Tag.BUILDING, 'white', ALL_POSITIONS], [Tag.EVENT, 'white', ALL_POSITIONS]],
      everyAdvance: true,
    },
    {name: CardName.PHOBOLOG, cubes: [[Tag.SPACE, 'white', [7, 10, 13, 15]]], everyAdvance: false},
    {name: CardName.TERACTOR, cubes: [[Tag.EARTH, 'white', ALL_POSITIONS]], everyAdvance: true},
    {name: CardName.THORGATE, cubes: [[Tag.POWER, 'white', [4, 6, 8, 10]]], everyAdvance: false},
  ];

  for (const run of cubes) {
    it(`${run.name} cubes sit on the tracks its card names`, () => {
      const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
      const placed = corpTrackCubes(corp(run.name), board)
        .map((cube) => `${board.definitions[cube.trackIndex].tags[0]} ${cube.cubeType} ${cube.position}`);
      const expected = run.cubes.flatMap(([tag, cubeType, positions]) => positions.map((position) => `${tag} ${cubeType} ${position}`));

      expect(placed).to.have.members(expected);
      expect(placed).to.have.length(expected.length);
      expect(corp(run.name).trackCubesTriggerEveryAdvance === true).eq(run.everyAdvance);
    });
  }

  // The Setup box (rulebook B p.1)
  for (const run of [
    {name: CardName.INVENTRIX, calls: ['removeBonusCard(B06)', 'removeBonusCard(B15)']},
    {name: CardName.PHOBOLOG, calls: ['addProjectCardsToBonusDeck(space, 2)']},
    {name: CardName.TERACTOR, calls: ['gainMc(25)']},
    {name: CardName.THARSIS_REPUBLIC, calls: ['placeCity()']},
    {name: CardName.THORGATE, calls: ['gainMc(10)']},
    {name: CardName.UNITED_NATIONS_MARS_INITIATIVE, calls: ['returnSetupBonusCardToBonusDeck()', 'addBonusCardToBonusDeck(B31)']},
  ]) {
    it(`${run.name} setup: ${run.calls.join(', ')}`, () => {
      const {bot, calls} = recordingBot();

      corp(run.name).setup!(bot);

      expect(calls).deep.eq(run.calls);
    });
  }

  it('Mining Guild setup puts 10 M€ on the card', () => {
    const {bot, corpState} = recordingBot();

    corp(CardName.MINING_GUILD).setup!(bot);

    expect(corpState.get('mcOnCard')).eq(10);
  });

  for (const run of [
    {card: new MagneticFieldGenerators(), calls: ['gainMc(4)']},
    {card: new LunarExports(), calls: []},
  ]) {
    it(`Credicor resolves ${run.card.name}, which costs ${run.card.cost}: ${run.calls.join() || 'nothing'}`, () => {
      const {bot, calls} = recordingBot();

      corp(CardName.CREDICOR).effect!.onProjectCardResolved!(bot, run.card);

      expect(calls).deep.eq(run.calls);
    });
  }

  for (const run of [
    {card: new ArtificialLake(), calls: ['gainMc(2)']},
    {card: new Asteroid(), calls: []},
  ]) {
    it(`Inventrix resolves ${run.card.name}: ${run.calls.join() || 'nothing'}`, () => {
      const {bot, calls} = recordingBot();

      corp(CardName.INVENTRIX).effect!.onProjectCardResolved!(bot, run.card);

      expect(calls).deep.eq(run.calls);
    });
  }

  // Before the action phase (rulebook B p.3)
  for (const run of [
    {name: CardName.ECOLINE, bonusCard: BonusCardId.B23_RAPID_SPROUTING},
    {name: CardName.INVENTRIX, bonusCard: BonusCardId.B25_DO_IT_RIGHT},
  ]) {
    it(`${run.name} adds ${run.bonusCard} to the action deck`, () => {
      const {bot, calls} = recordingBot();

      corp(run.name).beforeActionPhase!(bot);

      expect(calls).deep.eq([`addBonusCardToActionDeck(${run.bonusCard})`]);
    });
  }

  it('Ecoline stops adding its bonus card once the card removed itself', () => {
    const {bot, calls, corpState} = recordingBot();
    corpState.set(ACTION_DECK_BONUS_CARD_REMOVED, 1);

    corp(CardName.ECOLINE).beforeActionPhase!(bot);

    expect(calls).is.empty;
  });

  for (const run of [
    {generation: 1, calls: []},
    {generation: 2, calls: ['maybeMoveBonusCardToActionDeck()']},
  ]) {
    it(`UNMI in generation ${run.generation}: ${run.calls.join() || 'nothing'}`, () => {
      const {bot, calls} = recordingBot({generation: run.generation});

      corp(CardName.UNITED_NATIONS_MARS_INITIATIVE).beforeActionPhase!(bot);

      expect(calls).deep.eq(run.calls);
    });
  }

  it('Helion white cube draws a card in place of the temperature icon', () => {
    const {bot, calls} = recordingBot();
    expect(bot.marsBotBoard.tracks[BUILDING].definition.layout[6]).eq('temperature');

    const replacesIcon = corp(CardName.HELION).effect!.onTrackCubeTrigger!(bot, BUILDING, 6, 'white');

    expect(calls).deep.eq(['maybeDrawAndResolveProjectCard()']);
    expect(replacesIcon).is.true;
  });

  // The card says only "instead of raising the temperature", so any other icon still resolves
  it('Helion white cube on another icon draws a card and leaves the icon', () => {
    const board: ReadonlyArray<TrackDefinition> = [{tags: [Tag.BUILDING], productions: [], layout: [undefined, 'city']}];
    const {bot, calls} = recordingBot({board});

    const replacesIcon = corp(CardName.HELION).effect!.onTrackCubeTrigger!(bot, 0, 1, 'white');

    expect(calls).deep.eq(['maybeDrawAndResolveProjectCard()']);
    expect(replacesIcon).is.false;
  });

  it('Helion black cube raises the temperature on top of the icon', () => {
    const {bot, calls} = recordingBot();

    const replacesIcon = corp(CardName.HELION).effect!.onTrackCubeTrigger!(bot, EARTH, 3, 'black');

    expect(calls).deep.eq(['raiseTemperature(1)']);
    expect(replacesIcon).is.false;
  });

  for (const run of [
    {name: CardName.INTERPLANETARY_CINEMATICS, track: BUILDING, calls: ['gainMc(2)']},
    {name: CardName.INTERPLANETARY_CINEMATICS, track: EVENT, calls: ['gainMc(2)']},
    {name: CardName.INTERPLANETARY_CINEMATICS, track: SPACE, calls: []},
    {name: CardName.TERACTOR, track: EARTH, calls: ['gainMc(2)']},
    {name: CardName.TERACTOR, track: BUILDING, calls: []},
  ]) {
    it(`${run.name} cube on track ${run.track}: ${run.calls.join() || 'nothing'}`, () => {
      const {bot, calls} = recordingBot();

      corp(run.name).effect!.onTrackCubeTrigger!(bot, run.track, 1, 'white');

      expect(calls).deep.eq(run.calls);
    });
  }

  it('PhoboLog white cube resolves a bonus card', () => {
    const {bot, calls} = recordingBot();

    corp(CardName.PHOBOLOG).effect!.onTrackCubeTrigger!(bot, SPACE, 7, 'white');

    expect(calls).deep.eq(['maybeDrawAndResolveBonusCard()']);
  });

  it('ThorGate white cube resolves only the first tag of a card, then raises the temperature', () => {
    const {bot, calls} = recordingBot();

    corp(CardName.THORGATE).effect!.onTrackCubeTrigger!(bot, POWER, 4, 'white');

    expect(calls).deep.eq(['maybeDrawAndResolveProjectCardFirstTagOnly()', 'raiseTemperature(1)']);
  });

  // M€ counts down the card, and MarsBot keeps it
  for (const run of [
    {name: 'counts down the card', mcOnCard: 10, building: 3, gain: 5, card: 5, advances: 0},
    {name: 'refills an empty card, advances once and takes the rest off the new card', mcOnCard: 2, building: 3, gain: 5, card: 7, advances: 1},
    {name: 'advances once for each time the card empties', mcOnCard: 2, building: 3, gain: 25, card: 7, advances: 3},
    {name: 'stops with the building track at 18', mcOnCard: 2, building: 17, gain: 15, card: 10, advances: 1},
  ]) {
    it(`Mining Guild ${run.name}`, () => {
      const {bot, calls, corpState} = recordingBot();
      corpState.set('mcOnCard', run.mcOnCard);
      bot.marsBotBoard.tracks[BUILDING].position = run.building;

      corp(CardName.MINING_GUILD).effect!.onMcGained!(bot, run.gain);

      expect(corpState.get('mcOnCard')).eq(run.card);
      expect(calls).deep.eq(Array(run.advances).fill(`advanceTrack(${BUILDING})`));
    });
  }

  it('Mining Guild refills the card before the advance, so the M€ the advance earns comes off the new card', () => {
    const effect = corp(CardName.MINING_GUILD).effect!;
    const {bot, calls, corpState} = recordingBot({onAdvance: () => effect.onMcGained!(bot, 2)});
    corpState.set('mcOnCard', 1);
    bot.marsBotBoard.tracks[BUILDING].position = 3;

    effect.onMcGained!(bot, 1);

    expect(corpState.get('mcOnCard')).eq(8);
    expect(calls).deep.eq([`advanceTrack(${BUILDING})`]);
  });

  // Like Philares (BGG 3513998), nothing advances after the game has ended
  it('Mining Guild stops counting down once the game has ended', () => {
    const {bot, calls, corpState} = recordingBot();
    bot.game.phase = Phase.END;
    corpState.set('mcOnCard', 2);

    corp(CardName.MINING_GUILD).effect!.onMcGained!(bot, 5);

    expect(corpState.get('mcOnCard')).eq(2);
    expect(calls).is.empty;
  });

  // The cards MarsBot plays and the ones the player plays (rulebook B p.4)
  for (const hook of ['onProjectCardResolved', 'onHumanCardPlayed'] as const) {
    for (const run of [
      {card: new AsteroidMining(), calls: [`advanceTrack(${EVENT})`]},
      {card: new Asteroid(), calls: []},
    ]) {
      it(`Saturn Systems ${hook} with ${run.card.name}: ${run.calls.join() || 'nothing'}`, () => {
        const {bot, calls} = recordingBot();

        corp(CardName.SATURN_SYSTEMS).effect![hook]!(bot, run.card);

        expect(calls).deep.eq(run.calls);
      });
    }
  }

  // MarsBot's city moves the event track, the player's city pays MarsBot (rulebook B p.1)
  for (const run of [
    {tile: TileType.CITY, placedByMarsBot: true, calls: [`advanceTrack(${EVENT})`]},
    {tile: TileType.CITY, placedByMarsBot: false, calls: ['gainMc(2)']},
    {tile: TileType.CAPITAL, placedByMarsBot: false, calls: ['gainMc(2)']},
    {tile: TileType.GREENERY, placedByMarsBot: false, calls: []},
  ]) {
    it(`Tharsis Republic, ${TileType[run.tile]} placed by ${run.placedByMarsBot ? 'MarsBot' : 'the player'}: ${run.calls.join() || 'nothing'}`, () => {
      const {bot, calls} = recordingBot();

      corp(CardName.THARSIS_REPUBLIC).effect!.onTilePlaced!(bot, run.placedByMarsBot, run.tile, bot.game.board.spaces[0]);

      expect(calls).deep.eq(run.calls);
    });
  }
});
