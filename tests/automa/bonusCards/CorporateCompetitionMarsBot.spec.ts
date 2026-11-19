import {expect} from 'chai';
import {Resource} from '@/common/Resource';
import {TileType} from '@/common/TileType';
import {SpaceId} from '@/common/Types';
import {BoardName} from '@/common/boards/BoardName';
import {SpaceType} from '@/common/boards/SpaceType';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {AwardName} from '@/common/ma/AwardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBoard} from '@/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {CorporateCompetitionMarsBot} from '@/server/automa/bonusCards/CorporateCompetitionMarsBot';
import {Board} from '@/server/boards/Board';
import {Space} from '@/server/boards/Space';
import {Birds} from '@/server/cards/base/Birds';
import {cardsFromJSON} from '@/server/createCard';
import {TestGameOptions, testGame} from '../../TestGame';
import {setAllTracks, setTrack} from '../FakeMarsBot';
import {TRACK, recordingMarsBot} from '../corps/RecordingMarsBot';

/**
 * A bot with 5 M€ and a score of 5 in every award, in a 2-player game built with `gameOptions`.
 *
 * `calls` also records the track advances by tag and the project cards it plays.
 */
function competitionBot(gameOptions: Partial<TestGameOptions> = {}, fields: Partial<IMarsBot> = {}) {
  const [game, human, botPlayer] = testGame(2, gameOptions);
  const {marsBot, calls} = recordingMarsBot({
    game, player: botPlayer, humanPlayer: human, megacredits: 5, interceptsParameterRaise: () => false,
    awardValue: () => 5,
    advanceTrackOfTag: (tag) => calls.push(`advanceTrackOfTag(${tag})`) > 0,
    notifyTagAdvance: (tag) => {
      calls.push(`notifyTagAdvance(${tag})`);
    },
    resolveProjectCard: (card) => {
      calls.push(`resolveProjectCard(${card.name})`);
    },
    ...fields,
  });
  return {game, human, botPlayer, marsBot, calls};
}

function fund(bot: ReturnType<typeof competitionBot>, ...awards: ReadonlyArray<AwardName>): void {
  for (const name of awards) {
    bot.game.fundAward(bot.human, bot.game.awards.find((award) => award.name === name)!);
  }
}

function maxTrack(marsBot: IMarsBot, tag: Tag): void {
  const track = marsBot.marsBotBoard.tracks[marsBot.marsBotBoard.tagToTrack[tag]!];
  track.position = track.definition.layout.length - 1;
}

describe('CorporateCompetitionMarsBot', () => {
  for (const run of [
    {megacredits: 4, funded: ['Thermalist'], calls: ['maybeDrawAndResolveBonusCard()'], megacreditsAfter: 4},
    {megacredits: 5, funded: [], calls: ['maybeDrawAndResolveBonusCard()'], megacreditsAfter: 5},
    {megacredits: 5, funded: ['Thermalist'], calls: ['advanceTrackOfTag(power)'], megacreditsAfter: 0},
    {megacredits: 7, funded: ['Thermalist'], calls: ['advanceTrackOfTag(power)'], megacreditsAfter: 2},
  ] as const) {
    it('helps with a funded award for 5 M€, else draws another bonus card: ' + JSON.stringify(run), () => {
      const bot = competitionBot();
      bot.marsBot.megacredits = run.megacredits;
      fund(bot, ...run.funded);

      new CorporateCompetitionMarsBot().resolve(bot.marsBot);

      expect(bot.calls).deep.eq(run.calls);
      expect(bot.marsBot.megacredits).eq(run.megacreditsAfter);
    });
  }

  it('loses only the M€ left after a helper that cost M€', () => {
    const bot = competitionBot({}, {
      advanceTrackOfTag: () => {
        bot.marsBot.megacredits -= 3;
        return true;
      },
    });
    fund(bot, 'Thermalist');

    new CorporateCompetitionMarsBot().resolve(bot.marsBot);

    expect(bot.marsBot.megacredits).eq(0);
  });

  it('helps with Forecaster for free', () => {
    const bot = competitionBot({boardName: BoardName.TERRA_CIMMERIA_NOVA});
    fund(bot, 'Forecaster');
    bot.game.projectDeck.drawPile.push(...cardsFromJSON([CardName.MINE, CardName.ALGAE]).toReversed());

    new CorporateCompetitionMarsBot().resolve(bot.marsBot);

    expect(bot.calls).deep.eq(['resolveProjectCard(Algae)', 'gainMc(0)']);
    expect(bot.marsBot.megacredits).eq(5);
  });

  // MarsBot scores 5 in both awards
  for (const run of [
    {heat: 7, steel: 4, calls: ['advanceTrackOfTag(power)']},
    {heat: 7, steel: 6, calls: ['advanceTrackOfTag(space)']},
    {heat: 4, steel: 2, calls: ['advanceTrackOfTag(power)']},
    {heat: 5, steel: 6, calls: ['advanceTrackOfTag(power)']},
  ] as const) {
    it('helps with the award the player leads by the least, else the one MarsBot leads by the least: ' + JSON.stringify(run), () => {
      const bot = competitionBot();
      fund(bot, 'Thermalist', 'Miner');
      bot.human.heat = run.heat;
      bot.human.steel = run.steel;

      new CorporateCompetitionMarsBot().resolve(bot.marsBot);

      expect(bot.calls).deep.eq(run.calls);
    });
  }

  for (const run of [
    {human: {energy: 1, steel: 6}, production: {heat: 4}, calls: ['advanceTrackOfTag(power)']},
    {human: {heat: 6, steel: 2, titanium: 1}, production: {steel: 1, titanium: 1}, calls: ['advanceTrackOfTag(space)']},
  ] as const) {
    it("counts the player's production in Thermalist and Miner: " + JSON.stringify(run), () => {
      const bot = competitionBot();
      fund(bot, 'Thermalist', 'Miner');
      for (const [resource, amount] of Object.entries(run.human)) {
        bot.human.stock.add(resource as Resource, amount);
      }
      for (const [resource, amount] of Object.entries(run.production)) {
        bot.human.production.add(resource as Resource, amount);
      }

      new CorporateCompetitionMarsBot().resolve(bot.marsBot);

      expect(bot.calls).deep.eq(run.calls);
    });
  }

  for (const run of [
    {maxed: [Tag.POWER], calls: ['advanceTrackOfTag(space)'], megacreditsAfter: 0},
    {maxed: [Tag.POWER, Tag.SPACE], calls: ['maybeDrawAndResolveBonusCard()'], megacreditsAfter: 5},
  ] as const) {
    it('skips an award whose helper it cannot take: ' + JSON.stringify(run), () => {
      const bot = competitionBot();
      fund(bot, 'Thermalist', 'Miner');
      bot.human.heat = 5;
      bot.human.steel = 6;
      for (const tag of run.maxed) {
        maxTrack(bot.marsBot, tag);
      }

      new CorporateCompetitionMarsBot().resolve(bot.marsBot);

      expect(bot.calls).deep.eq(run.calls);
      expect(bot.marsBot.megacredits).eq(run.megacreditsAfter);
    });
  }

  // The board is Tharsis's with the Venus track, every marker on space `base` unless `positions` moves it
  for (const run of [
    {award: 'Scientist', base: 0, positions: {}, maxed: [], calls: ['advanceTrackOfTag(science)']},
    {award: 'Scientist', base: 0, positions: {}, maxed: [Tag.SCIENCE], calls: []},
    {award: 'Banker', base: 0, positions: {building: 3, event: 2}, maxed: [], calls: [`advanceTrack(${TRACK.event})`, 'notifyTagAdvance(event)']},
    {award: 'Banker', base: 0, positions: {building: 2, event: 2}, maxed: [], calls: [`advanceTrack(${TRACK.building})`, 'notifyTagAdvance(building)']},
    {award: 'Traveller', base: 0, positions: {earth: 3, power: 1}, maxed: [], calls: [`advanceTrack(${TRACK.earth})`, 'notifyTagAdvance(earth)']},
    {award: 'Traveller', base: 0, positions: {earth: 3, power: 6}, maxed: [], calls: [`advanceTrack(${TRACK.power})`, 'notifyTagAdvance(jovian)']},
    {award: 'Traveller', base: 0, positions: {power: 1}, maxed: [Tag.EARTH], calls: []},
    {award: 'Mogul', base: 0, positions: {science: 4}, maxed: [], calls: [`advanceTrack(${TRACK.science})`]},
    {award: 'Mogul', base: 0, positions: {}, maxed: [Tag.SCIENCE], calls: []},
    {award: 'Collector', base: 1, positions: {venus: 0}, maxed: [], calls: [`advanceTrack(${THARSIS_MARSBOT_BOARD.length})`]},
    {award: 'Visionary', base: 1, positions: {venus: 0}, maxed: [], calls: [`advanceTrack(${TRACK.building})`]},
    {award: 'Politician', base: 0, positions: {}, maxed: [], calls: []},
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

      const helped = new CorporateCompetitionMarsBot().tryHelperAction(bot.marsBot, run.award);

      expect(bot.calls).deep.eq(run.calls);
      expect(helped).eq(run.calls.length > 0);
    });
  }

  // The first card of `deck` goes on top of the project deck
  for (const run of [
    {award: 'Magnate', deck: [CardName.TARDIGRADES, CardName.MINE], calls: ['resolveProjectCard(Mine)', 'gainMc(0)']},
    {award: 'Celebrity', deck: [CardName.MINE, CardName.GIANT_ICE_ASTEROID], calls: ['resolveProjectCard(Giant Ice Asteroid)', 'gainMc(0)']},
    {award: 'Incorporator', deck: [CardName.GIANT_ICE_ASTEROID, CardName.MINE], calls: ['resolveProjectCard(Mine)', 'gainMc(0)']},
    {award: 'Forecaster', deck: [CardName.MINE, CardName.ALGAE], calls: ['resolveProjectCard(Algae)', 'gainMc(0)']},
    {award: 'Administrator', deck: [CardName.ICE_CAP_MELTING, CardName.MICRO_MILLS], calls: ['resolveProjectCard(Micro-Mills)', 'gainMc(5)']},
    {award: 'Innovator', deck: [CardName.TARDIGRADES], calls: ['resolveProjectCard(Tardigrades)', 'gainMc(0)']},
  ] as const) {
    it('reveals cards until one the award names and plays it: ' + JSON.stringify(run), () => {
      const bot = competitionBot();
      bot.game.projectDeck.drawPile.push(...cardsFromJSON(run.deck).toReversed());

      const helped = new CorporateCompetitionMarsBot().tryHelperAction(bot.marsBot, run.award);

      expect(bot.calls).deep.eq(run.calls);
      expect(helped).is.true;
    });
  }

  it('gives up revealing once the whole deck is seen', () => {
    const bot = competitionBot();
    const deck = bot.game.projectDeck;
    deck.drawPile.splice(0, deck.drawPile.length, ...cardsFromJSON([CardName.TARDIGRADES, CardName.BIRDS]));
    deck.discardPile.length = 0;

    const helped = new CorporateCompetitionMarsBot().tryHelperAction(bot.marsBot, 'Magnate');

    expect(bot.calls).is.empty;
    expect(helped).is.false;
  });

  // Unrestricted, the greenery goes on 29, on the equator and the edge, or with an ocean on 32, on 23, inland next to it
  for (const run of [
    {award: 'Landlord', ocean: false, placed: true},
    {award: 'Desert Settler', ocean: false, placed: true},
    {award: 'Estate Dealer', ocean: false, placed: false},
    {award: 'Estate Dealer', ocean: true, placed: true},
    {award: 'Suburbian', ocean: true, placed: true},
    {award: 'Highlander', ocean: true, placed: true},
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

      const helped = new CorporateCompetitionMarsBot().tryHelperAction(bot.marsBot, run.award);

      const greeneries = board.getGreeneries(bot.botPlayer);
      expect(greeneries).has.length(run.placed ? 1 : 0);
      expect(greeneries.every(where[run.award])).is.true;
      expect(helped).eq(run.placed);
    });
  }

  for (const run of [
    {modularMA: false, placed: false},
    {modularMA: true, placed: true},
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

      const helped = new CorporateCompetitionMarsBot().tryHelperAction(bot.marsBot, 'Highlander');

      expect(board.getGreeneries(bot.botPlayer)).has.length(run.placed ? 1 : 0);
      expect(helped).eq(run.placed);
    });
  }

  for (const run of [
    {award: 'Metropolist', preserve: false, placed: true},
    {award: 'Founder', preserve: false, placed: false},
    {award: 'Founder', preserve: true, placed: true},
  ] as const) {
    it('places a city where the award says: ' + JSON.stringify(run), () => {
      const bot = competitionBot();
      const board = bot.game.board;
      const preserve = board.getSpaceOrThrow('53' as SpaceId);
      if (run.preserve) {
        bot.game.simpleAddTile(bot.human, preserve, {tileType: TileType.NATURAL_PRESERVE});
      }

      const helped = new CorporateCompetitionMarsBot().tryHelperAction(bot.marsBot, run.award);

      const cities = board.getCities(bot.botPlayer);
      expect(cities).has.length(run.placed ? 1 : 0);
      if (run.preserve) {
        expect(board.getAdjacentSpaces(cities[0])).includes(preserve);
      }
      expect(helped).eq(run.placed);
    });
  }

  it("removes the player's animal for Excentric", () => {
    const bot = competitionBot();
    const birds = new Birds();
    birds.resourceCount = 2;
    bot.human.playedCards.push(birds);

    const helped = new CorporateCompetitionMarsBot().tryHelperAction(bot.marsBot, 'Excentric');

    expect(birds.resourceCount).eq(1);
    expect(helped).is.true;
  });

  it('raises TR by 2 for Benefactor', () => {
    const bot = competitionBot();
    const tr = bot.botPlayer.terraformRating;

    const helped = new CorporateCompetitionMarsBot().tryHelperAction(bot.marsBot, 'Benefactor');

    expect(bot.botPlayer.terraformRating).eq(tr + 2);
    expect(helped).is.true;
  });
});
