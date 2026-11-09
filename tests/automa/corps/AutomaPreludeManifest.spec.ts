import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {fakeMarsBot, setAllTracks, setTrack} from '../FakeMarsBot';
import {CardName} from '../../../src/common/cards/CardName';
import {Tag} from '../../../src/common/cards/Tag';
import {TileType} from '../../../src/common/TileType';
import {BonusCardId, CubeType} from '../../../src/common/automa/AutomaTypes';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
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

/** The bot has a player marker on the first two spaces of the board, which `removeMarker` takes off. */
function recordingBot(generation: number = 1) {
  const [game] = testGame(1);
  game.generation = generation;
  const calls: Array<string> = [];
  const corpState = new Map<string, number>();
  const markers = new Set(game.board.spaces.slice(0, 2));
  const record = (call: string) => calls.push(call) > 0;
  const marsBot = fakeMarsBot({
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
  return {marsBot, calls, corpState};
}

/** The calls the corporation makes when MarsBot resolves `card`. */
function resolving(name: CardName, card: IProjectCard): Array<string> {
  const {marsBot, calls} = recordingBot();
  corp(name).effect!.onProjectCardResolved!(marsBot, card);
  return calls;
}

function corp(name: CardName) {
  return AUTOMA_PRELUDE_MANIFEST.corps[name]!;
}

// Track indexes on the Tharsis board
const BUILDING = 0;
const SPACE = 1;
const EVENT = 2;
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
  const cubes: Array<{name: CardName, cubes: Array<CubeRow>, everyAdvance?: true}> = [
    {name: CardName.CHEUNG_SHING_MARS, cubes: [[Tag.BUILDING, 'credit', ALL_POSITIONS.slice(3)]]},
    {name: CardName.POINT_LUNA, cubes: [[Tag.EARTH, 'white', [1, 5, 9, 13, 17]], [Tag.EARTH, 'black', [3, 7, 11, 15]]]},
    {name: CardName.VALLEY_TRUST, cubes: [[Tag.SCIENCE, 'white', [8, 16]]]},
    {name: CardName.ASTRODRILL, cubes: [[Tag.SPACE, 'white', [2, 4, 7, 10, 13]], [Tag.SPACE, 'black', [5, 11, 16]]]},
    {name: CardName.FACTORUM, cubes: [[Tag.BUILDING, 'white', ALL_POSITIONS]], everyAdvance: true},
    {name: CardName.MANUTECH, cubes: [Tag.BUILDING, Tag.SPACE, Tag.EVENT, Tag.SCIENCE, Tag.POWER, Tag.EARTH, Tag.PLANT, Tag.VENUS].map((tag): CubeRow => [tag, 'black', [5, 12]])},
    {name: CardName.ECOTEC, cubes: [[Tag.PLANT, 'white', ALL_POSITIONS]]},
    {name: CardName.KUIPER_COOPERATIVE, cubes: [[Tag.SPACE, 'white', [4, 8, 12]], [Tag.SPACE, 'black', [7, 10, 14]]]},
    {name: CardName.PALLADIN_SHIPPING, cubes: [[Tag.SPACE, 'white', [3, 4, 6, 8, 10, 11]], [Tag.EVENT, 'black', [3, 4, 6, 8, 10, 11]]]},
  ];

  for (const run of cubes) {
    it(`puts the cubes of each corporation on the tracks its card names, ${run.name}`, () => {
      const board = new MarsBotBoard([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
      const placed = corpTrackCubes(corp(run.name), board)
        .map((cube) => `${board.definitions[cube.trackIndex].tags[0]} ${cube.cubeType} ${cube.position}`);
      const expected = run.cubes.flatMap(([tag, cubeType, positions]) => positions.map((position) => `${tag} ${cubeType} ${position}`));

      expect([...placed].sort()).deep.eq([...expected].sort());
      expect(corp(run.name).trackCubesTriggerEveryAdvance === true).eq(run.everyAdvance === true);
    });
  }

  for (const [name, expected] of [
    [CardName.ROBINSON_INDUSTRIES, ['gainMc(10)']],
    [CardName.VALLEY_TRUST, ['drawProjectCardsToActionDeck(1)']],
    [CardName.VITOR, ['removeBonusCard(B04)']],
    [CardName.ARCADIAN_COMMUNITIES, ['resolveBonusCard(B22)']],
    [CardName.NIRGAL_ENTERPRISES, ['removeBonusCard(B04)']],
    [CardName.PALLADIN_SHIPPING, ['gainMc(5)']],
    [CardName.SAGITTA_FRONTIER_SERVICES, ['gainMc(8)']],
    [CardName.TYCHO_MAGNETICS, ['addBonusCardToBottomOfBonusDeck(B30)']],
  ] as const) {
    it(`follows the Setup box of each corporation that has one, ${name}`, () => {
      const {marsBot, calls} = recordingBot();

      corp(name).setup!(marsBot);

      expect(calls).deep.eq(expected);
    });
  }

  it('follows the action deck bonus card of each corporation that has one', () => {
    expect([CardName.ROBINSON_INDUSTRIES, CardName.VITOR, CardName.ARCADIAN_COMMUNITIES, CardName.FACTORUM].map((name) => corp(name).actionDeckBonusCard))
      .deep.eq([BonusCardId.B28_DIVERSIFICATION, BonusCardId.B04_OVERACHIEVEMENT, BonusCardId.B22_SETTLERS, BonusCardId.B24_SUPPLY_AND_DEMAND]);
  });

  // These cubes read only their colour, and the plant track is the least advanced one
  for (const [name, cube, expected] of [
    [CardName.CHEUNG_SHING_MARS, 'credit', ['gainMc(5)']],
    [CardName.VALLEY_TRUST, 'white', ['maybeDrawAndResolveProjectCard()']],
    [CardName.POINT_LUNA, 'white', [`advanceTrack(${PLANT})`]],
    [CardName.POINT_LUNA, 'black', [`advanceTrack(${SPACE})`]],
    [CardName.ASTRODRILL, 'white', [`advanceTrack(${PLANT})`]],
    [CardName.ASTRODRILL, 'black', [`advanceTrack(${SPACE})`]],
    [CardName.KUIPER_COOPERATIVE, 'white', ['raiseTemperature(1)']],
    [CardName.KUIPER_COOPERATIVE, 'black', ['placeOcean()']],
  ] as const) {
    it(`resolves the cubes of Cheung Shing, Valley Trust, Point Luna, Astrodrill and Kuiper, ${name} ${cube}`, () => {
      const {marsBot, calls} = recordingBot();
      setAllTracks(marsBot, 2);
      setTrack(marsBot, Tag.PLANT, 1);

      corp(name).effect!.onTrackCubeTrigger!(marsBot, BUILDING, 1, cube);

      expect(calls).deep.eq(expected);
    });
  }

  it('Factorum stores 1 M€ for each advance of the building track and none for another track', () => {
    const {marsBot, corpState} = recordingBot();
    const onCube = corp(CardName.FACTORUM).effect!.onTrackCubeTrigger!;

    onCube(marsBot, BUILDING, 1, 'white');
    onCube(marsBot, BUILDING, 2, 'white');
    onCube(marsBot, SPACE, 1, 'white');

    expect(corpState.get('mcOnCard')).eq(2);
  });

  // The VP printed on the card counts, not what it scores now
  it('Vitor gains 3 M€ for a card whose printed VP is not negative', () => {
    const gained = [new Ants(), new DustSeals(), new BiomassCombustors(), new MicroMills()]
      .map((card) => resolving(CardName.VITOR, card));

    expect(gained).deep.eq([['gainMc(3)'], ['gainMc(3)'], [], []]);
  });

  it('Arcadian Communities pays 3 M€ for the tile MarsBot puts on a space with its marker, and no one else', () => {
    const {marsBot, calls} = recordingBot();
    const [markedByPlayerTile, markedByBotTile, unmarked] = marsBot.game.board.spaces;
    const onTilePlaced = corp(CardName.ARCADIAN_COMMUNITIES).effect!.onTilePlaced!;

    onTilePlaced(marsBot, false, TileType.CITY, markedByPlayerTile);
    onTilePlaced(marsBot, true, TileType.CITY, unmarked);
    onTilePlaced(marsBot, true, TileType.CITY, markedByBotTile);

    expect(calls).deep.eq(['gainMc(3)']);
  });

  it('Manutech advances a track once more after #5 and #12 but not after another space', () => {
    const {marsBot, calls} = recordingBot();

    for (const position of [5, 6, 12]) {
      corp(CardName.MANUTECH).effect!.afterTrackSpaceResolved!(marsBot, EVENT, position);
    }

    expect(calls).deep.eq([`advanceTrack(${EVENT})`, `advanceTrack(${EVENT})`]);
  });

  it('Ecotec collects plant resources, 2 from setup and 1 for each Plant, Microbe and Animal tag, and spends 5', () => {
    const {marsBot, calls, corpState} = recordingBot();

    corp(CardName.ECOTEC).setup!(marsBot);
    for (const tag of [Tag.PLANT, Tag.MICROBE, Tag.ANIMAL, Tag.SPACE]) {
      corp(CardName.ECOTEC).effect!.onTagResolved!(marsBot, tag);
    }
    corp(CardName.ECOTEC).beforeActionPhase!(marsBot);

    expect(corpState.get('plantResources')).eq(0);
    expect(calls).deep.eq([`advanceTrack(${PLANT})`]);
  });

  it('Nirgal Enterprises adds 2 to every award', () => {
    expect(corp(CardName.NIRGAL_ENTERPRISES).effect!.awardScoreBonus!(recordingBot().marsBot)).eq(2);
  });

  const milestone = 'maybeClaimMilestone()';
  const award = 'maybeFundAward()';
  for (const [generation, expected] of [[1, []], [2, [milestone]], [5, [milestone]], [6, [award]], [9, [award]], [10, [milestone]]] as const) {
    it(`Nirgal Enterprises claims a milestone in generations 2 to 5 and from 10, and funds an award in 6 to 9, generation ${generation}`, () => {
      const {marsBot, calls} = recordingBot(generation);

      corp(CardName.NIRGAL_ENTERPRISES).beforeActionPhase!(marsBot);

      expect(calls).deep.eq(expected);
    });
  }

  // A white and a black cube on the card pay for one temperature step
  it('Palladin Shipping raises the temperature once a white and a black cube are on the card', () => {
    const {marsBot, calls, corpState} = recordingBot();
    const onCube = corp(CardName.PALLADIN_SHIPPING).effect!.onTrackCubeTrigger!;

    onCube(marsBot, SPACE, 3, 'white');
    onCube(marsBot, SPACE, 4, 'white');
    onCube(marsBot, EVENT, 3, 'black');

    expect(calls).deep.eq(['raiseTemperature(1)']);
    expect(corpState.get('whiteCubesOnCard')).eq(1);
    expect(corpState.get('blackCubesOnCard')).eq(0);
  });

  // A tagless card pays the Failed Action amount again, and an event counts its Event tag
  it('Sagitta Frontier Services pays more M€ for a card with no tags than for one tag, and nothing for two', () => {
    const paid = [new MicroMills(), new ArtificialLake(), new Asteroid()]
      .map((card) => resolving(CardName.SAGITTA_FRONTIER_SERVICES, card));

    expect(paid).deep.eq([['gainMc(5)'], ['gainMc(1)'], []]);
  });

  it('Spire collects a science resource for a card with 2 tags, none for 1, and spends 10 on a city and 1 TR', () => {
    const {marsBot, calls, corpState} = recordingBot();
    const onCard = corp(CardName.SPIRE).effect!.onProjectCardResolved!;
    corpState.set('scienceResources', 9);

    onCard(marsBot, new ArtificialLake());
    expect(corpState.get('scienceResources')).eq(9);
    onCard(marsBot, new Asteroid());
    corp(CardName.SPIRE).beforeActionPhase!(marsBot);

    expect(corpState.get('scienceResources')).eq(0);
    expect(calls).deep.eq(['placeCity()', 'raiseTR(1)']);
  });
});
