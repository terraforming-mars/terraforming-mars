import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {fakeMarsBot, setAllTracks, setTrack} from '../FakeMarsBot';
import {CardName} from '../../../src/common/cards/CardName';
import {Tag} from '../../../src/common/cards/Tag';
import {TileType} from '../../../src/common/TileType';
import {BonusCardId, CubeType} from '../../../src/common/automa/AutomaTypes';
import {IMarsBotCorp} from '../../../src/server/automa/IMarsBotCorp';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {Space} from '../../../src/server/boards/Space';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '../../../src/server/automa/boards/VenusMarsBot';
import {corpTrackCubes} from '../../../src/server/automa/corpTrackCubes';
import {AUTOMA_PRELUDE_MANIFEST} from '../../../src/server/automa/corps/AutomaPreludeManifest';
import {Ants} from '../../../src/server/cards/base/Ants';
import {ArtificialLake} from '../../../src/server/cards/base/ArtificialLake';
import {Asteroid} from '../../../src/server/cards/base/Asteroid';
import {BiomassCombustors} from '../../../src/server/cards/base/BiomassCombustors';
import {DustSeals} from '../../../src/server/cards/base/DustSeals';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';

/** `markers` are the spaces holding a player marker of the bot, which `removeMarker` takes off. */
function recordingBot(generation: number = 1) {
  const [game] = testGame(1);
  game.generation = generation;
  const calls: Array<string> = [];
  const corpState = new Map<string, number>();
  const markers = new Set<Space>();
  const record = (call: string) => {
    calls.push(call);
    return true;
  };
  const bot = fakeMarsBot(THARSIS_MARSBOT_BOARD, {
    game,
    failedActionMc: 5,
    gainMc: (amount) => record(`gainMc(${amount})`),
    raiseTR: (steps) => record(`raiseTR(${steps})`),
    advanceTrack: (trackIndex) => record(`advanceTrack(${trackIndex})`),
    raiseTemperature: (steps) => record(`raiseTemperature(${steps})`),
    placeOcean: () => record('placeOcean()'),
    placeCity: () => record('placeCity()'),
    removeBonusCard: (id) => record(`removeBonusCard(${id})`),
    resolveBonusCard: (id) => record(`resolveBonusCard(${id})`),
    addBonusCardToBottomOfBonusDeck: (id) => record(`addBonusCardToBottomOfBonusDeck(${id})`),
    drawProjectCardsToActionDeck: (count) => record(`drawProjectCardsToActionDeck(${count})`),
    maybeDrawAndResolveProjectCard: () => record('maybeDrawAndResolveProjectCard()'),
    maybeClaimMilestone: () => record('maybeClaimMilestone()'),
    maybeFundAward: () => record('maybeFundAward()'),
    removeMarker: (space) => markers.delete(space),
    getCorpState: (key) => corpState.get(key) ?? 0,
    setCorpState: (key, value) => corpState.set(key, value),
  });
  return {bot, calls, corpState, markers};
}

function corp(name: CardName): IMarsBotCorp {
  return AUTOMA_PRELUDE_MANIFEST.corps[name]!;
}

// Track indexes on the Tharsis board
const BUILDING = 0;
const SPACE = 1;
const EVENT = 2;
const SCIENCE = 3;
const EARTH = 5;
const PLANT = 6;

const ALL_POSITIONS = Array.from({length: 18}, (_, i) => i + 1);

type CubeRow = [Tag, CubeType, Array<number>];

describe('AutomaPreludeManifest', () => {
  it('keys each of the sixteen corporations by its own name', () => {
    const entries = Object.entries(AUTOMA_PRELUDE_MANIFEST.corps);

    expect(entries).to.have.length(16);
    expect(entries.filter(([name, found]) => found.name !== name)).is.empty;
  });

  // The corporation cards name the tracks by tag, the cube lists name them by index.
  const cubes: Array<{name: CardName, cubes: Array<CubeRow>, venus?: true, everyAdvance?: true}> = [
    {name: CardName.CHEUNG_SHING_MARS, cubes: [[Tag.BUILDING, 'credit', ALL_POSITIONS.slice(3)]]},
    {name: CardName.POINT_LUNA, cubes: [[Tag.EARTH, 'white', [1, 5, 9, 13, 17]], [Tag.EARTH, 'black', [3, 7, 11, 15]]]},
    {name: CardName.VALLEY_TRUST, cubes: [[Tag.SCIENCE, 'white', [8, 16]]]},
    {name: CardName.ASTRODRILL, cubes: [[Tag.SPACE, 'white', [2, 4, 7, 10, 13]], [Tag.SPACE, 'black', [5, 11, 16]]]},
    {name: CardName.FACTORUM, cubes: [[Tag.BUILDING, 'white', ALL_POSITIONS]], everyAdvance: true},
    {
      name: CardName.MANUTECH,
      cubes: [Tag.BUILDING, Tag.SPACE, Tag.EVENT, Tag.SCIENCE, Tag.POWER, Tag.EARTH, Tag.PLANT, Tag.VENUS]
        .map((tag): CubeRow => [tag, 'black', [5, 12]]),
      venus: true,
    },
    {name: CardName.ECOTEC, cubes: [[Tag.PLANT, 'white', ALL_POSITIONS]]},
    {name: CardName.KUIPER_COOPERATIVE, cubes: [[Tag.SPACE, 'white', [4, 8, 12]], [Tag.SPACE, 'black', [7, 10, 14]]]},
    {name: CardName.PALLADIN_SHIPPING, cubes: [[Tag.SPACE, 'white', [3, 4, 6, 8, 10, 11]], [Tag.EVENT, 'black', [3, 4, 6, 8, 10, 11]]]},
  ];

  for (const run of cubes) {
    it(`${run.name} cubes sit on the tracks its card names`, () => {
      const board = new MarsBotBoard(run.venus ? [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK] : THARSIS_MARSBOT_BOARD);
      const placed = corpTrackCubes(corp(run.name), board)
        .map((cube) => `${board.definitions[cube.trackIndex].tags[0]} ${cube.cubeType} ${cube.position}`);
      const expected = run.cubes.flatMap(([tag, cubeType, positions]) => positions.map((position) => `${tag} ${cubeType} ${position}`));

      expect([...placed].sort()).deep.eq([...expected].sort());
      expect(corp(run.name).trackCubesTriggerEveryAdvance === true).eq(run.everyAdvance === true);
    });
  }

  // The Setup box
  for (const run of [
    {name: CardName.ROBINSON_INDUSTRIES, calls: ['gainMc(10)']},
    {name: CardName.VALLEY_TRUST, calls: ['drawProjectCardsToActionDeck(1)']},
    {name: CardName.VITOR, calls: ['removeBonusCard(B04)']},
    {name: CardName.ARCADIAN_COMMUNITIES, calls: ['resolveBonusCard(B22)']},
    {name: CardName.NIRGAL_ENTERPRISES, calls: ['removeBonusCard(B04)']},
    {name: CardName.PALLADIN_SHIPPING, calls: ['gainMc(5)']},
    {name: CardName.SAGITTA_FRONTIER_SERVICES, calls: ['gainMc(8)']},
    {name: CardName.TYCHO_MAGNETICS, calls: ['addBonusCardToBottomOfBonusDeck(B30)']},
  ]) {
    it(`${run.name} setup: ${run.calls.join()}`, () => {
      const {bot, calls} = recordingBot();

      corp(run.name).setup!(bot);

      expect(calls).deep.eq(run.calls);
    });
  }

  it('Robinson Industries, Vitor, Arcadian Communities and Factorum each add their own bonus card to the action deck', () => {
    const names = [CardName.ROBINSON_INDUSTRIES, CardName.VITOR, CardName.ARCADIAN_COMMUNITIES, CardName.FACTORUM];

    expect(names.map((name) => corp(name).actionDeckBonusCard)).deep.eq(
      [BonusCardId.B28_DIVERSIFICATION, BonusCardId.B04_OVERACHIEVEMENT, BonusCardId.B22_SETTLERS, BonusCardId.B24_SUPPLY_AND_DEMAND]);
  });

  for (const run of [
    {name: CardName.CHEUNG_SHING_MARS, track: BUILDING, position: 4, cube: 'credit', calls: ['gainMc(5)']},
    {name: CardName.VALLEY_TRUST, track: SCIENCE, position: 8, cube: 'white', calls: ['maybeDrawAndResolveProjectCard()']},
    {name: CardName.KUIPER_COOPERATIVE, track: SPACE, position: 4, cube: 'white', calls: ['raiseTemperature(1)']},
    {name: CardName.KUIPER_COOPERATIVE, track: SPACE, position: 7, cube: 'black', calls: ['placeOcean()']},
  ] as const) {
    it(`${run.name} ${run.cube} cube: ${run.calls.join()}`, () => {
      const {bot, calls} = recordingBot();

      corp(run.name).effect!.onTrackCubeTrigger!(bot, run.track, run.position, run.cube);

      expect(calls).deep.eq(run.calls);
    });
  }

  it('Point Luna and Astrodrill advance the least-advanced track for a white cube and the space track for a black one', () => {
    const {bot, calls} = recordingBot();
    setAllTracks(bot, 2);
    setTrack(bot, Tag.PLANT, 1);

    for (const name of [CardName.POINT_LUNA, CardName.ASTRODRILL]) {
      corp(name).effect!.onTrackCubeTrigger!(bot, EARTH, 1, 'white');
      corp(name).effect!.onTrackCubeTrigger!(bot, EARTH, 3, 'black');
    }

    const advances = [`advanceTrack(${PLANT})`, `advanceTrack(${SPACE})`];
    expect(calls).deep.eq([...advances, ...advances]);
  });

  it('Factorum stores 1 M€ for each advance of the building track and none for another track', () => {
    const {bot, corpState} = recordingBot();
    const onCube = corp(CardName.FACTORUM).effect!.onTrackCubeTrigger!;

    onCube(bot, BUILDING, 1, 'white');
    onCube(bot, BUILDING, 2, 'white');
    onCube(bot, SPACE, 1, 'white');

    expect(corpState.get('mcOnCard')).eq(2);
  });

  // The VP printed on the card counts, not what it scores now
  it('Vitor gains 3 M€ for a card whose printed VP is not negative', () => {
    const gained = [new Ants(), new DustSeals(), new BiomassCombustors(), new MicroMills()].map((card) => {
      const {bot, calls} = recordingBot();
      corp(CardName.VITOR).effect!.onProjectCardResolved!(bot, card);
      return calls;
    });

    expect(gained).deep.eq([['gainMc(3)'], ['gainMc(3)'], [], []]);
  });

  it('Arcadian Communities pays 3 M€ for the tile MarsBot puts on a space with its marker, and no one else', () => {
    const {bot, calls, markers} = recordingBot();
    const [marked, unmarked] = bot.game.board.spaces;
    markers.add(marked);
    const onTilePlaced = corp(CardName.ARCADIAN_COMMUNITIES).effect!.onTilePlaced!;

    onTilePlaced(bot, false, TileType.CITY, marked);
    onTilePlaced(bot, true, TileType.CITY, unmarked);
    expect(calls).is.empty;
    onTilePlaced(bot, true, TileType.CITY, marked);

    expect(calls).deep.eq(['gainMc(3)']);
  });

  it('Manutech advances a track once more after #5 and #12 but not after another space', () => {
    const {bot, calls} = recordingBot();

    for (const position of [5, 6, 12]) {
      corp(CardName.MANUTECH).effect!.afterTrackSpaceResolved!(bot, EVENT, position);
    }

    expect(calls).deep.eq([`advanceTrack(${EVENT})`, `advanceTrack(${EVENT})`]);
  });

  it('Ecotec collects plant resources, 2 from setup and 1 for each Plant, Microbe and Animal tag, and spends 5', () => {
    const {bot, calls, corpState} = recordingBot();

    corp(CardName.ECOTEC).setup!(bot);
    for (const tag of [Tag.PLANT, Tag.MICROBE, Tag.ANIMAL, Tag.SPACE]) {
      corp(CardName.ECOTEC).effect!.onTagResolved!(bot, tag);
    }
    expect(corpState.get('plantResources')).eq(5);
    corp(CardName.ECOTEC).beforeActionPhase!(bot);

    expect(corpState.get('plantResources')).eq(0);
    expect(calls).deep.eq([`advanceTrack(${PLANT})`]);
  });

  it('Nirgal Enterprises adds 2 to every award, claims a milestone in generations 2 to 5 and from 10, and funds an award in 6 to 9', () => {
    expect(corp(CardName.NIRGAL_ENTERPRISES).effect!.awardScoreBonus!(recordingBot().bot)).eq(2);
    const milestone = 'maybeClaimMilestone()';
    const award = 'maybeFundAward()';
    for (const [generation, expected] of [[1, []], [2, [milestone]], [5, [milestone]], [6, [award]], [9, [award]], [10, [milestone]]] as const) {
      const {bot, calls} = recordingBot(generation);

      corp(CardName.NIRGAL_ENTERPRISES).beforeActionPhase!(bot);

      expect(calls, `generation ${generation}`).deep.eq(expected);
    }
  });

  // A white and a black cube on the card pay for one temperature step
  it('Palladin Shipping raises the temperature once a white and a black cube are on the card', () => {
    const {bot, calls, corpState} = recordingBot();
    const onCube = corp(CardName.PALLADIN_SHIPPING).effect!.onTrackCubeTrigger!;

    onCube(bot, SPACE, 3, 'white');
    onCube(bot, SPACE, 4, 'white');
    onCube(bot, EVENT, 3, 'black');

    expect(calls).deep.eq(['raiseTemperature(1)']);
    expect(corpState.get('whiteCubesOnCard')).eq(1);
    expect(corpState.get('blackCubesOnCard')).eq(0);
  });

  // A tagless card pays the Failed Action amount again, and an event counts its Event tag
  it('Sagitta Frontier Services pays more M€ for a card with no tags than for one tag, and nothing for two', () => {
    const paid = [new MicroMills(), new ArtificialLake(), new Asteroid()].map((card) => {
      const {bot, calls} = recordingBot();
      corp(CardName.SAGITTA_FRONTIER_SERVICES).effect!.onProjectCardResolved!(bot, card);
      return calls;
    });

    expect(paid).deep.eq([['gainMc(5)'], ['gainMc(1)'], []]);
  });

  it('Spire collects a science resource for a card with 2 tags, none for 1, and spends 10 on a city and 1 TR', () => {
    const {bot, calls, corpState} = recordingBot();
    const onCard = corp(CardName.SPIRE).effect!.onProjectCardResolved!;
    corpState.set('scienceResources', 9);

    onCard(bot, new ArtificialLake());
    expect(corpState.get('scienceResources')).eq(9);
    onCard(bot, new Asteroid());
    expect(corpState.get('scienceResources')).eq(10);
    corp(CardName.SPIRE).beforeActionPhase!(bot);

    expect(corpState.get('scienceResources')).eq(0);
    expect(calls).deep.eq(['placeCity()', 'raiseTR(1)']);
  });
});
