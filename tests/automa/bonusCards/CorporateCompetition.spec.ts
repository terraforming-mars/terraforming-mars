import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {SpaceId} from '@/common/Types';
import {BoardName} from '@/common/boards/BoardName';
import {SpaceType} from '@/common/boards/SpaceType';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBoard} from '@/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {CorporateCompetition} from '@/server/automa/bonusCards/CorporateCompetition';
import {Board} from '@/server/boards/Board';
import {Space} from '@/server/boards/Space';
import {Birds} from '@/server/cards/base/Birds';
import {cardsFromJSON} from '@/server/createCard';
import {setAllTracks, setTrack} from '../FakeMarsBot';
import {TRACK} from '../corps/RecordingMarsBot';
import {competitionBot, fund} from './CorporateCompetitionBot';

function maxTrack(marsBot: IMarsBot, tag: Tag): void {
  const track = marsBot.marsBotBoard.tracks[marsBot.marsBotBoard.tagToTrack[tag]!];
  track.position = track.definition.layout.length - 1;
}

describe('CorporateCompetition', () => {
  for (const run of [
    {megacredits: 4, funded: ['Thermalist'], expected: ['maybeDrawAndResolveBonusCard()']},
    {megacredits: 5, funded: [], expected: ['maybeDrawAndResolveBonusCard()']},
    {megacredits: 5, funded: ['Thermalist'], expected: ['advanceTrackOfTag(power)', 'loseMc(5)']},
  ] as const) {
    it('helps with a funded award for 5 M€, else draws another bonus card: ' + JSON.stringify(run), () => {
      const bot = competitionBot();
      bot.marsBot.megacredits = run.megacredits;
      fund(bot, ...run.funded);

      new CorporateCompetition().resolve(bot.marsBot);

      expect(bot.calls).deep.eq(run.expected);
    });
  }

  // MarsBot scores 5 in both awards
  for (const run of [
    {heat: 7, steel: 4, expected: ['advanceTrackOfTag(power)', 'loseMc(5)']},
    {heat: 7, steel: 6, expected: ['advanceTrackOfTag(space)', 'loseMc(5)']},
    {heat: 4, steel: 2, expected: ['advanceTrackOfTag(power)', 'loseMc(5)']},
    {heat: 5, steel: 6, expected: ['advanceTrackOfTag(power)', 'loseMc(5)']},
  ] as const) {
    it('helps with the award the player leads by the least, else the one MarsBot leads by the least: ' + JSON.stringify(run), () => {
      const bot = competitionBot();
      fund(bot, 'Thermalist', 'Miner');
      bot.human.heat = run.heat;
      bot.human.steel = run.steel;

      new CorporateCompetition().resolve(bot.marsBot);

      expect(bot.calls).deep.eq(run.expected);
    });
  }

  for (const run of [
    {maxed: [Tag.POWER], expected: ['advanceTrackOfTag(space)', 'loseMc(5)']},
    {maxed: [Tag.POWER, Tag.SPACE], expected: ['maybeDrawAndResolveBonusCard()']},
  ] as const) {
    it('skips an award whose helper it cannot take: ' + JSON.stringify(run), () => {
      const bot = competitionBot();
      fund(bot, 'Thermalist', 'Miner');
      bot.human.heat = 5;
      bot.human.steel = 6;
      for (const tag of run.maxed) {
        maxTrack(bot.marsBot, tag);
      }

      new CorporateCompetition().resolve(bot.marsBot);

      expect(bot.calls).deep.eq(run.expected);
    });
  }

  // The board is Tharsis's with the Venus track, every marker on space `base` unless `positions` moves it
  for (const run of [
    {award: 'Scientist', base: 0, positions: {}, maxed: [], expected: ['advanceTrackOfTag(science)']},
    {award: 'Scientist', base: 0, positions: {}, maxed: [Tag.SCIENCE], expected: []},
    {award: 'Banker', base: 0, positions: {building: 3, event: 2}, maxed: [], expected: [`advanceTrack(${TRACK.event})`, 'onTagAdvance(event)']},
    {award: 'Banker', base: 0, positions: {building: 2, event: 2}, maxed: [], expected: [`advanceTrack(${TRACK.building})`, 'onTagAdvance(building)']},
    {award: 'Traveller', base: 0, positions: {earth: 3, power: 1}, maxed: [], expected: [`advanceTrack(${TRACK.earth})`, 'onTagAdvance(earth)']},
    {award: 'Traveller', base: 0, positions: {earth: 3, power: 6}, maxed: [], expected: [`advanceTrack(${TRACK.power})`, 'onTagAdvance(jovian)']},
    {award: 'Traveller', base: 0, positions: {power: 1}, maxed: [Tag.EARTH], expected: []},
    {award: 'Mogul', base: 0, positions: {science: 4}, maxed: [], expected: [`advanceTrack(${TRACK.science})`]},
    {award: 'Mogul', base: 0, positions: {}, maxed: [Tag.SCIENCE], expected: []},
    {award: 'Collector', base: 1, positions: {venus: 0}, maxed: [], expected: [`advanceTrack(${THARSIS_MARSBOT_BOARD.length})`]},
    {award: 'Visionary', base: 1, positions: {venus: 0}, maxed: [], expected: [`advanceTrack(${TRACK.building})`]},
    {award: 'Politician', base: 0, positions: {}, maxed: [], expected: []},
  ] as const) {
    it('advances the track the award names: ' + JSON.stringify(run), () => {
      const bot = competitionBot({}, {marsBotBoard: new MarsBotBoard([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK])});
      setAllTracks(bot.marsBot, run.base);
      for (const [tag, position] of Object.entries(run.positions)) {
        setTrack(bot.marsBot, tag as Tag, position);
      }
      for (const tag of run.maxed) {
        maxTrack(bot.marsBot, tag);
      }

      const helped = new CorporateCompetition().tryHelperAction(bot.marsBot, run.award);

      expect(bot.calls).deep.eq(run.expected);
      expect(helped).eq(run.expected.length > 0);
    });
  }

  // The first card of `deck` goes on top of the project deck
  for (const run of [
    {award: 'Magnate', deck: [CardName.TARDIGRADES, CardName.MINE], expected: ['resolveProjectCard(Mine)', 'gainMc(0)']},
    {award: 'Celebrity', deck: [CardName.MINE, CardName.GIANT_ICE_ASTEROID], expected: ['resolveProjectCard(Giant Ice Asteroid)', 'gainMc(0)']},
    {award: 'Incorporator', deck: [CardName.GIANT_ICE_ASTEROID, CardName.MINE], expected: ['resolveProjectCard(Mine)', 'gainMc(0)']},
    {award: 'Forecaster', deck: [CardName.MINE, CardName.ALGAE], expected: ['resolveProjectCard(Algae)', 'gainMc(0)']},
    {award: 'Administrator', deck: [CardName.ICE_CAP_MELTING, CardName.MICRO_MILLS], expected: ['resolveProjectCard(Micro-Mills)', 'gainMc(5)']},
    {award: 'Innovator', deck: [CardName.TARDIGRADES], expected: ['resolveProjectCard(Tardigrades)', 'gainMc(0)']},
  ] as const) {
    it('reveals cards until one the award names and plays it: ' + JSON.stringify(run), () => {
      const bot = competitionBot();
      bot.game.projectDeck.drawPile.push(...cardsFromJSON(run.deck).toReversed());

      const helped = new CorporateCompetition().tryHelperAction(bot.marsBot, run.award);

      expect(bot.calls).deep.eq(run.expected);
      expect(helped).is.true;
    });
  }

  it('gives up revealing once the whole deck is seen', () => {
    const bot = competitionBot();
    const deck = bot.game.projectDeck;
    deck.drawPile.splice(0, deck.drawPile.length, ...cardsFromJSON([CardName.TARDIGRADES, CardName.BIRDS]));
    deck.discardPile.length = 0;

    const helped = new CorporateCompetition().tryHelperAction(bot.marsBot, 'Magnate');

    expect(bot.calls).is.empty;
    expect(helped).is.false;
  });

  for (const run of [
    {award: 'Landlord', ocean: false, expected: true},
    {award: 'Desert Settler', ocean: false, expected: true},
    {award: 'Estate Dealer', ocean: false, expected: false},
    {award: 'Suburbian', ocean: true, expected: true},
    {award: 'Highlander', ocean: true, expected: true},
  ] as const) {
    it('places a greenery where the award says: ' + JSON.stringify(run), () => {
      const bot = competitionBot();
      const board = bot.game.board;
      if (run.ocean) {
        bot.game.simpleAddTile(bot.human, board.getSpaceOrThrow('32' as SpaceId), {tileType: TileType.OCEAN});
      }
      const nextToOcean = (space: Space) => board.getAdjacentSpaces(space).some(Board.isOceanSpace);
      const where: Record<typeof run.award, (space: Space) => boolean> = {
        'Landlord': () => true,
        'Desert Settler': (space) => space.y > board.equatorRow,
        'Estate Dealer': nextToOcean,
        'Suburbian': (space) => space.edge,
        'Highlander': (space) => !nextToOcean(space),
      };

      const helped = new CorporateCompetition().tryHelperAction(bot.marsBot, run.award);

      const expected = board.getAvailableSpacesForGreenery(bot.botPlayer).filter(where[run.award]);
      const placedIds = bot.greenerySpaces.map((space) => space.id);
      expect(placedIds).deep.eq(expected.map((space) => space.id));
      expect(helped).eq(run.expected);
    });
  }

  for (const run of [
    {modularMA: false, expected: false},
    {modularMA: true, expected: true},
  ] as const) {
    it('keeps the Vastitas Borealis Highlander greenery away from the spaces reserved for an ocean, unlike the modular one: ' + JSON.stringify(run), () => {
      const bot = competitionBot({boardName: BoardName.VASTITAS_BOREALIS_NOVA, modularMA: run.modularMA});
      const board = bot.game.board;
      const nextToReservedOcean = (space: Space) => board.getAdjacentSpaces(space).some((s) => s.spaceType === SpaceType.OCEAN);
      for (const space of board.getSpaces(SpaceType.LAND)) {
        if (space.tile === undefined && !nextToReservedOcean(space)) {
          bot.game.simpleAddTile(bot.human, space, {tileType: TileType.CITY});
        }
      }

      const helped = new CorporateCompetition().tryHelperAction(bot.marsBot, 'Highlander');

      expect(helped).eq(run.expected);
    });
  }

  for (const run of [
    {award: 'Metropolist', preserve: false, expected: true},
    {award: 'Founder', preserve: false, expected: false},
    {award: 'Founder', preserve: true, expected: true},
  ] as const) {
    it('places a city where the award says: ' + JSON.stringify(run), () => {
      const bot = competitionBot();
      const board = bot.game.board;
      const preserve = board.getSpaceOrThrow('53' as SpaceId);
      if (run.preserve) {
        bot.game.simpleAddTile(bot.human, preserve, {tileType: TileType.NATURAL_PRESERVE});
      }

      const helped = new CorporateCompetition().tryHelperAction(bot.marsBot, run.award);

      const cities = board.getCities(bot.botPlayer);
      expect(cities).has.length(run.expected ? 1 : 0);
      if (run.preserve) {
        expect(board.getAdjacentSpaces(cities[0])).includes(preserve);
      }
      expect(helped).eq(run.expected);
    });
  }

  it("removes the player's animal for Excentric", () => {
    const bot = competitionBot();
    const birds = new Birds();
    birds.resourceCount = 2;
    bot.human.playedCards.push(birds);

    const helped = new CorporateCompetition().tryHelperAction(bot.marsBot, 'Excentric');

    expect(birds.resourceCount).eq(1);
    expect(helped).is.true;
  });
});
