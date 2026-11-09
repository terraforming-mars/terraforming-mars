import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {fakeMarsBot} from '../FakeMarsBot';
import {Phase} from '../../../src/common/Phase';
import {CardName} from '../../../src/common/cards/CardName';
import {Tag} from '../../../src/common/cards/Tag';
import {TileType} from '../../../src/common/TileType';
import {CubeType} from '../../../src/common/automa/AutomaTypes';
import {IMarsBotCorp} from '../../../src/server/automa/IMarsBotCorp';
import {IMarsBot} from '../../../src/server/automa/IMarsBot';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';
import {corpTrackCubes} from '../../../src/server/automa/corpTrackCubes';
import {AUTOMA_BASE_MANIFEST} from '../../../src/server/automa/corps/AutomaBaseManifest';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {ArtificialLake} from '../../../src/server/cards/base/ArtificialLake';
import {Asteroid} from '../../../src/server/cards/base/Asteroid';
import {AsteroidMining} from '../../../src/server/cards/base/AsteroidMining';
import {MagneticFieldGenerators} from '../../../src/server/cards/base/MagneticFieldGenerators';

// Track indexes on the Tharsis board
const BUILDING = 0;
const SPACE = 1;
const EVENT = 2;
const POWER = 4;
const EARTH = 5;

const corp = (name: CardName): IMarsBotCorp => AUTOMA_BASE_MANIFEST.corps[name]!;

/** A bot that records the calls a corporation makes into it as `name(arguments)`. */
function recordingBot(onAdvance?: () => void) {
  const [game] = testGame(1);
  const calls: Array<string> = [];
  const corpState = new Map<string, number>();
  const record = (name: string) => (...args: Array<unknown>) => {
    calls.push(`${name}(${args.join(', ')})`);
  };
  const marsBot: IMarsBot = fakeMarsBot({
    game,
    gainMc: record('gainMc'),
    advanceTrack: (trackIndex) => {
      record('advanceTrack')(trackIndex);
      marsBot.marsBotBoard.tracks[trackIndex].position++;
      onAdvance?.();
    },
    raiseTemperature: record('raiseTemperature'),
    placeCity: record('placeCity'),
    removeBonusCard: record('removeBonusCard'),
    addBonusCardToActionDeck: record('addBonusCardToActionDeck'),
    addBonusCardToBonusDeck: record('addBonusCardToBonusDeck'),
    addProjectCardsToBonusDeck: record('addProjectCardsToBonusDeck'),
    returnSetupBonusCardToBonusDeck: record('returnSetupBonusCardToBonusDeck'),
    maybeMoveBonusCardToActionDeck: record('maybeMoveBonusCardToActionDeck'),
    maybeDrawAndResolveProjectCard: record('maybeDrawAndResolveProjectCard'),
    maybeDrawAndResolveProjectCardFirstTagOnly: record('maybeDrawAndResolveProjectCardFirstTagOnly'),
    maybeDrawAndResolveBonusCard: record('maybeDrawAndResolveBonusCard'),
    getCorpState: (key) => corpState.get(key) ?? 0,
    setCorpState: (key, value) => corpState.set(key, value),
  });
  return {marsBot, calls, corpState};
}

/** A trigger on a corporation, applied to a fresh bot. */
type Trigger = (marsBot: IMarsBot, c: IMarsBotCorp) => void;

const setup: Trigger = (marsBot, c) => c.setup!(marsBot);
const beforeActionPhase: Trigger = (marsBot, c) => c.beforeActionPhase!(marsBot);
const cube = (track: number, cubeType: CubeType): Trigger => (marsBot, c) => c.effect!.onTrackCubeTrigger!(marsBot, track, 1, cubeType);
const resolves = (card: IProjectCard): Trigger => (marsBot, c) => c.effect!.onProjectCardResolved!(marsBot, card);
const plays = (card: IProjectCard): Trigger => (marsBot, c) => c.effect!.onHumanCardPlayed!(marsBot, card);
const tile = (tileType: TileType, byMarsBot: boolean): Trigger => (marsBot, c) => c.effect!.onTilePlaced!(marsBot, byMarsBot, tileType, marsBot.game.board.spaces[0]);
const generation2: Trigger = (marsBot, c) => {
  marsBot.game.generation = 2;
  c.beforeActionPhase!(marsBot);
};

// The calls each corporation makes into the bot. Rulebook B p.1 for the Setup box and Tharsis Republic,
// p.3 for the start of a generation, p.4 for Saturn Systems.
const handlers: Array<[CardName, string, Trigger, Array<string>]> = [
  [CardName.CREDICOR, 'card that costs 20', resolves(new MagneticFieldGenerators()), ['gainMc(4)']],
  [CardName.CREDICOR, 'card that costs 15', resolves(new ArtificialLake()), []],
  [CardName.ECOLINE, 'before the action phase', beforeActionPhase, ['addBonusCardToActionDeck(B23)']],
  [CardName.HELION, 'white cube', cube(BUILDING, 'white'), ['maybeDrawAndResolveProjectCard()']],
  [CardName.HELION, 'black cube', cube(EARTH, 'black'), ['raiseTemperature(1)']],
  [CardName.INTERPLANETARY_CINEMATICS, 'building cube', cube(BUILDING, 'white'), ['gainMc(2)']],
  [CardName.INTERPLANETARY_CINEMATICS, 'event cube', cube(EVENT, 'white'), ['gainMc(2)']],
  [CardName.INVENTRIX, 'setup', setup, ['removeBonusCard(B06)', 'removeBonusCard(B15)']],
  [CardName.INVENTRIX, 'card with requirements', resolves(new ArtificialLake()), ['gainMc(2)']],
  [CardName.INVENTRIX, 'card without requirements', resolves(new MagneticFieldGenerators()), []],
  [CardName.PHOBOLOG, 'setup', setup, ['addProjectCardsToBonusDeck(space, 2)']],
  [CardName.PHOBOLOG, 'white cube', cube(SPACE, 'white'), ['maybeDrawAndResolveBonusCard()']],
  [CardName.SATURN_SYSTEMS, 'Jovian card MarsBot resolves', resolves(new AsteroidMining()), [`advanceTrack(${EVENT})`]],
  [CardName.SATURN_SYSTEMS, 'space card MarsBot resolves', resolves(new Asteroid()), []],
  [CardName.SATURN_SYSTEMS, 'Jovian card the player plays', plays(new AsteroidMining()), [`advanceTrack(${EVENT})`]],
  [CardName.SATURN_SYSTEMS, 'space card the player plays', plays(new Asteroid()), []],
  [CardName.TERACTOR, 'setup', setup, ['gainMc(25)']],
  [CardName.TERACTOR, 'Earth cube', cube(EARTH, 'white'), ['gainMc(2)']],
  [CardName.THARSIS_REPUBLIC, 'setup', setup, ['placeCity()']],
  [CardName.THARSIS_REPUBLIC, 'MarsBot city', tile(TileType.CITY, true), [`advanceTrack(${EVENT})`]],
  [CardName.THARSIS_REPUBLIC, 'player city', tile(TileType.CITY, false), ['gainMc(2)']],
  [CardName.THARSIS_REPUBLIC, 'player capital', tile(TileType.CAPITAL, false), ['gainMc(2)']],
  [CardName.THARSIS_REPUBLIC, 'player greenery', tile(TileType.GREENERY, false), []],
  [CardName.THORGATE, 'setup', setup, ['gainMc(10)']],
  [CardName.THORGATE, 'white cube', cube(POWER, 'white'), ['maybeDrawAndResolveProjectCardFirstTagOnly()', 'raiseTemperature(1)']],
  [CardName.UNITED_NATIONS_MARS_INITIATIVE, 'setup', setup, ['returnSetupBonusCardToBonusDeck()', 'addBonusCardToBonusDeck(B31)']],
  [CardName.UNITED_NATIONS_MARS_INITIATIVE, 'before the action phase in generation 1', beforeActionPhase, []],
  [CardName.UNITED_NATIONS_MARS_INITIATIVE, 'before the action phase in generation 2', generation2, ['maybeMoveBonusCardToActionDeck()']],
];

describe('AutomaBaseManifest', () => {
  for (const [name, label, trigger, expected] of handlers) {
    it(`${name} calls into MarsBot as its card says, ${label}`, () => {
      expect(corp(name).name).eq(name);
      const {marsBot, calls} = recordingBot();
      trigger(marsBot, corp(name));
      expect(calls).deep.eq(expected);
    });
  }

  // The cards name the tracks by tag, the cube lists name them by index
  it('puts the cubes on the tracks the cards name', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const all = Array.from({length: 18}, (_, i) => i + 1);
    const expected = ([
      [CardName.HELION, Tag.BUILDING, 'white', [6]],
      [CardName.HELION, Tag.SPACE, 'white', [9]],
      [CardName.HELION, Tag.SCIENCE, 'white', [10]],
      [CardName.HELION, Tag.POWER, 'white', [5, 9]],
      [CardName.HELION, Tag.PLANT, 'white', [11]],
      [CardName.HELION, Tag.EARTH, 'black', [3, 6, 9, 12, 13, 14]],
      [CardName.INTERPLANETARY_CINEMATICS, Tag.BUILDING, 'white', all],
      [CardName.INTERPLANETARY_CINEMATICS, Tag.EVENT, 'white', all],
      [CardName.PHOBOLOG, Tag.SPACE, 'white', [7, 10, 13, 15]],
      [CardName.TERACTOR, Tag.EARTH, 'white', all],
      [CardName.THORGATE, Tag.POWER, 'white', [4, 6, 8, 10]],
    ] as const).flatMap(([name, tag, cubeType, positions]) => positions.map((p) => `${name} ${tag} ${cubeType} ${p}`));
    const corps = Object.values(AUTOMA_BASE_MANIFEST.corps);
    const placed = corps.flatMap((c) => corpTrackCubes(c, board).map((x) => `${c.name} ${board.definitions[x.trackIndex].tags[0]} ${x.cubeType} ${x.position}`));

    expect(placed.sort()).deep.eq(expected.sort());
    expect(corps.filter((c) => c.trackCubesTriggerEveryAdvance).map((c) => c.name)).to.have.members([CardName.INTERPLANETARY_CINEMATICS, CardName.TERACTOR]);
  });

  // The card replaces the temperature step only
  it('Helion white cube replaces a temperature step, and no other icon', () => {
    const white = (position: number) => corp(CardName.HELION).effect!.onTrackCubeTrigger!(recordingBot().marsBot, BUILDING, position, 'white');
    expect(white(6)).is.true;
    expect(white(7)).is.false;
  });

  // The M€ MarsBot earns comes off the card, and MarsBot keeps it
  for (const run of [
    {gain: 5, card: 5, advances: 0},
    {mcOnCard: 2, gain: 5, card: 7, advances: 1},
    {mcOnCard: 2, gain: 25, card: 7, advances: 3},
    {mcOnCard: 2, building: 17, gain: 15, card: 10, advances: 1},
  ]) {
    it('Mining Guild counts down from 10, and advances the building track each time the card empties: ' + JSON.stringify(run), () => {
      const {marsBot, calls, corpState} = recordingBot();
      corp(CardName.MINING_GUILD).setup!(marsBot);
      if (run.mcOnCard !== undefined) {
        corpState.set('mcOnCard', run.mcOnCard);
      }
      marsBot.marsBotBoard.tracks[BUILDING].position = run.building ?? 3;
      corp(CardName.MINING_GUILD).effect!.onMcGained!(marsBot, run.gain);
      expect(corpState.get('mcOnCard')).eq(run.card);
      expect(calls).deep.eq(Array(run.advances).fill(`advanceTrack(${BUILDING})`));
    });
  }

  it('Mining Guild refills the card before the advance, so the M€ the advance earns comes off the new card', () => {
    const effect = corp(CardName.MINING_GUILD).effect!;
    const {marsBot, corpState} = recordingBot(() => effect.onMcGained!(marsBot, 2));
    corpState.set('mcOnCard', 1);
    effect.onMcGained!(marsBot, 1);
    expect(corpState.get('mcOnCard')).eq(8);
  });

  // Like Philares (BGG 3513998), nothing advances after the game has ended
  it('Mining Guild stops counting down once the game has ended', () => {
    const {marsBot, calls, corpState} = recordingBot();
    marsBot.game.phase = Phase.END;
    corpState.set('mcOnCard', 2);
    corp(CardName.MINING_GUILD).effect!.onMcGained!(marsBot, 5);
    expect(corpState.get('mcOnCard')).eq(2);
    expect(calls).is.empty;
  });
});
