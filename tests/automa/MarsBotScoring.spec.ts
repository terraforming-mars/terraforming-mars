import {expect} from 'chai';
import {SpaceType} from '@/common/boards/SpaceType';
import {TileType} from '@/common/TileType';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {currentMcPerVP, getMcPerVP, MarsBotScoring} from '@/server/automa/MarsBotScoring';
import {Banker} from '@/server/awards/Banker';
import {Thermalist} from '@/server/awards/Thermalist';
import {Space} from '@/server/boards/Space';
import {Mayor} from '@/server/milestones/Mayor';
import {Terraformer} from '@/server/milestones/Terraformer';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {testGame} from '../TestGame';
import {fakeMarsBot} from './FakeMarsBot';

/** A bot on a 2-player game, with the award values in `awardValues`. */
function setup(fields: Partial<IMarsBot> = {}, awardValues: Record<string, number> = {}) {
  const [game, human, botPlayer] = testGame(2, {turmoilExtension: true});
  const marsBot = fakeMarsBot({
    game,
    player: botPlayer,
    humanPlayer: human,
    megacredits: 0,
    neuralInstanceSpace: undefined,
    awardValue: (award) => awardValues[award.name] ?? 0,
    ...fields,
  });
  return {game, human, botPlayer, marsBot};
}

/** An empty land space whose six neighbours are all empty land. */
function inlandSpace(marsBot: IMarsBot): Space {
  return marsBot.game.board.getAvailableSpacesOnLand(marsBot.player).find((space) => {
    const adjacent = marsBot.game.board.getAdjacentSpaces(space);
    return adjacent.length === 6 && adjacent.every((s) => s.spaceType === SpaceType.LAND && s.tile === undefined);
  })!;
}

describe('MarsBotScoring', () => {
  it("counts MarsBot's terraform rating", () => {
    const {botPlayer, marsBot} = setup();
    botPlayer.terraformRating = 25;

    expect(new MarsBotScoring(marsBot).calculate().terraformRating).eq(25);
  });

  it('scores 5 VP for each milestone MarsBot claimed', () => {
    const {game, human, botPlayer, marsBot} = setup();
    game.claimedMilestones.push({player: botPlayer, milestone: new Terraformer()}, {player: human, milestone: new Mayor()});

    const vp = new MarsBotScoring(marsBot).calculate();

    expect(vp.milestones).eq(5);
    expect(vp.detailsMilestones).deep.eq([{message: 'Claimed ${0} milestone', messageArgs: ['Terraformer'], victoryPoint: 5}]);
  });

  for (const run of [
    {awardValue: 2, expected: 0},
    {awardValue: 3, expected: 5},
    {awardValue: 4, expected: 5},
  ]) {
    it('scores 5 VP for each funded award MarsBot ties or leads: ' + JSON.stringify(run), () => {
      const {game, human, marsBot} = setup({}, {Thermalist: run.awardValue});
      human.heat = 3;
      game.fundedAwards.push({player: human, award: new Thermalist()});

      expect(new MarsBotScoring(marsBot).calculate().awards).eq(run.expected);
    });
  }

  it('lists the awards MarsBot scores', () => {
    const {game, human, marsBot} = setup({}, {Banker: 1});
    game.fundedAwards.push({player: human, award: new Banker()});

    expect(new MarsBotScoring(marsBot).calculate().detailsAwards)
      .deep.eq([{message: '${0} place for ${1} award (funded by ${2})', messageArgs: ['1st', 'Banker', human.name], victoryPoint: 5}]);
  });

  it("scores MarsBot's greeneries, and the greeneries next to its cities", () => {
    const {game, human, botPlayer, marsBot} = setup();
    const city = inlandSpace(marsBot);
    game.simpleAddTile(botPlayer, city, {tileType: TileType.CITY});
    const [first, second] = game.board.getAdjacentSpaces(city);
    game.simpleAddTile(botPlayer, first, {tileType: TileType.GREENERY});
    game.simpleAddTile(human, second, {tileType: TileType.GREENERY});

    const vp = new MarsBotScoring(marsBot).calculate();

    expect({greenery: vp.greenery, cityAdjacentGreenery: vp.cityAdjacentGreenery}).deep.eq({greenery: 1, cityAdjacentGreenery: 2});
  });

  it("scores 1 VP for each space next to the Neural Instance that the player doesn't hold", () => {
    const {game, human, botPlayer, marsBot: withoutTile} = setup();
    const space = inlandSpace(withoutTile);
    const marsBot = fakeMarsBot({...withoutTile, neuralInstanceSpace: space});
    const [first, second] = game.board.getAdjacentSpaces(space);
    game.simpleAddTile(human, first, {tileType: TileType.GREENERY});
    game.simpleAddTile(botPlayer, second, {tileType: TileType.GREENERY});

    expect(new MarsBotScoring(marsBot).calculate().neuralInstance).eq(5);
  });

  it('scores no Neural Instance VP before MarsBot places it', () => {
    const {marsBot} = setup();

    expect(new MarsBotScoring(marsBot).calculate().neuralInstance).eq(0);
  });

  for (const run of [
    {generation: 1, expected: 2},
    {generation: 19, expected: 17},
    {generation: 20, expected: 0},
  ]) {
    it("turns MarsBot's M€ into VP at the generation's rate: " + JSON.stringify(run), () => {
      const {game, marsBot} = setup({megacredits: 17});
      game.generation = run.generation;

      expect(new MarsBotScoring(marsBot).calculate().mcToVP).eq(run.expected);
    });
  }

  for (const run of [
    {generation: 12, preludeExtension: false, expected: 8},
    {generation: 13, preludeExtension: false, expected: 7},
    {generation: 19, preludeExtension: false, expected: 1},
    {generation: 20, preludeExtension: false, expected: undefined},
    {generation: 10, preludeExtension: true, expected: 8},
    {generation: 11, preludeExtension: true, expected: 7},
    {generation: 17, preludeExtension: true, expected: 1},
    {generation: 18, preludeExtension: true, expected: undefined},
  ]) {
    it('reads the M€ per VP table: ' + JSON.stringify(run), () => {
      const [game] = testGame(2, {preludeExtension: run.preludeExtension});
      game.generation = run.generation;

      expect(getMcPerVP(run.generation, run.preludeExtension)).eq(run.expected);
      expect(currentMcPerVP(game)).eq(run.expected);
    });
  }

  for (const run of [
    {verminInEffect: false, expected: 0},
    {verminInEffect: true, expected: -1},
  ]) {
    it("takes 1 VP for each of MarsBot's cities with Vermin in effect: " + JSON.stringify(run), () => {
      const {game, botPlayer, marsBot} = setup();
      game.simpleAddTile(botPlayer, inlandSpace(marsBot), {tileType: TileType.CITY});
      game.verminInEffect = run.verminInEffect;

      expect(new MarsBotScoring(marsBot).calculate().vermin).eq(run.expected);
    });
  }

  it('scores 1 VP for the chairman and each party leader MarsBot holds', () => {
    const {game, botPlayer, marsBot} = setup();
    const turmoil = Turmoil.getTurmoil(game);
    turmoil.chairman = botPlayer;
    turmoil.parties[0].partyLeader = botPlayer;
    turmoil.parties[1].partyLeader = botPlayer;

    expect(new MarsBotScoring(marsBot).calculate().turmoilVP).eq(3);
  });

  it('scores no Turmoil VP without Turmoil', () => {
    const [game, human, botPlayer] = testGame(2);
    const marsBot = fakeMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: 0, neuralInstanceSpace: undefined});

    expect(new MarsBotScoring(marsBot).calculate().turmoilVP).eq(0);
  });

  it('adds up every part, with the corp VP', () => {
    const {game, human, botPlayer, marsBot} = setup({megacredits: 16});
    game.claimedMilestones.push({player: botPlayer, milestone: new Terraformer()});
    Turmoil.getTurmoil(game).chairman = botPlayer;
    game.fundedAwards.push({player: human, award: new Banker()});

    const vp = new MarsBotScoring(marsBot, 4).calculate();

    expect({corpVP: vp.corpVP, total: vp.total}).deep.eq({corpVP: 4, total: 20 + 5 + 5 + 2 + 1 + 4});
  });
});
