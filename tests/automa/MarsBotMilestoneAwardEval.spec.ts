import {expect} from 'chai';
import {Phase} from '@/common/Phase';
import {IMarsBot} from '@/server/automa/IMarsBot';
import * as MarsBotMilestoneAwardEval from '@/server/automa/MarsBotMilestoneAwardEval';
import {Banker} from '@/server/awards/Banker';
import {Miner} from '@/server/awards/Miner';
import {Thermalist} from '@/server/awards/Thermalist';
import {Venuphile} from '@/server/awards/Venuphile';
import {Briber} from '@/server/milestones/Briber';
import {Gardener} from '@/server/milestones/Gardener';
import {Hoverlord} from '@/server/milestones/Hoverlord';
import {Mayor} from '@/server/milestones/Mayor';
import {Terraformer} from '@/server/milestones/Terraformer';
import {testGame} from '../TestGame';
import {addCity} from '../TestingUtils';
import {recordingMarsBot} from './corps/RecordingMarsBot';

/*
 * Builds a 2-player game with a fake MarsBot in the second seat.
 *
 * `calls` lists the `IMarsBot` methods the code under test called, and the fake scores each award from
 * `awardValues`.
 */
function setup(fields: Partial<IMarsBot> = {}, awardValues: Record<string, number> = {}) {
  const [game, human, botPlayer] = testGame(2);
  const {marsBot, calls} = recordingMarsBot({
    game,
    player: botPlayer,
    humanPlayer: human,
    megacredits: 0,
    floaters: 0,
    awardValue: (award) => awardValues[award.name] ?? 0,
    ...fields,
  });
  return {game, human, botPlayer, marsBot, calls};
}

describe('MarsBotMilestoneAwardEval', () => {
  for (const run of [
    {megacredits: 19, expected: false},
    {megacredits: 20, expected: true},
  ]) {
    it("uses the milestone's MarsBot rule when it has one: " + JSON.stringify(run), () => {
      const {botPlayer, marsBot} = setup({megacredits: run.megacredits});
      botPlayer.megaCredits = 100;

      expect(MarsBotMilestoneAwardEval.marsBotCanClaimMilestone(new Briber(), marsBot)).eq(run.expected);
    });
  }

  for (const run of [
    {terraformRating: 34, expected: false},
    {terraformRating: 35, expected: true},
  ]) {
    it("runs the milestone against MarsBot's player otherwise: " + JSON.stringify(run), () => {
      const {botPlayer, marsBot} = setup();
      botPlayer.terraformRating = run.terraformRating;

      expect(MarsBotMilestoneAwardEval.marsBotCanClaimMilestone(new Terraformer(), marsBot)).eq(run.expected);
    });
  }

  for (const run of [
    {milestone: new Mayor(), cities: 1, megaCredits: 0, turmoil: false, expected: 2},
    {milestone: new Mayor(), cities: 4, megaCredits: 0, turmoil: false, expected: 0},
    {milestone: new Terraformer(), cities: 0, megaCredits: 0, turmoil: false, expected: 15},
    {milestone: new Terraformer(), cities: 0, megaCredits: 0, turmoil: true, expected: 6},
    {milestone: new Briber(), cities: 0, megaCredits: 0, turmoil: false, expected: Infinity},
    {milestone: new Briber(), cities: 0, megaCredits: 20, turmoil: false, expected: 0},
  ]) {
    const {milestone, ...inputs} = run;
    it(`counts the steps the player is from meeting ${milestone.name}: ${JSON.stringify(inputs)}`, () => {
      const [/* game */, player] = testGame(2, {turmoilExtension: run.turmoil});
      for (let city = 0; city < run.cities; city++) {
        addCity(player);
      }
      player.megaCredits = run.megaCredits;

      expect(MarsBotMilestoneAwardEval.stepsToMeetMilestone(milestone, player)).eq(run.expected);
    });
  }

  it('lists the unclaimed milestones MarsBot meets', () => {
    const {game, human, botPlayer, marsBot} = setup({floaters: 7});
    const [terraformer, mayor, hoverlord] = [new Terraformer(), new Mayor(), new Hoverlord()];
    game.milestones = [terraformer, mayor, hoverlord, new Gardener()];
    botPlayer.terraformRating = 35;
    addCity(botPlayer);
    addCity(botPlayer);
    addCity(botPlayer);
    game.claimedMilestones.push({player: human, milestone: mayor});

    expect(MarsBotMilestoneAwardEval.getClaimableMilestones(marsBot)).deep.eq([terraformer, hoverlord]);
  });

  it('lists no milestone once all are claimed', () => {
    const {game, human, botPlayer, marsBot} = setup();
    game.milestones = [new Terraformer(), new Mayor(), new Gardener(), new Hoverlord()];
    botPlayer.terraformRating = 35;
    for (const milestone of game.milestones.slice(1)) {
      game.claimedMilestones.push({player: human, milestone});
    }

    expect(MarsBotMilestoneAwardEval.getClaimableMilestones(marsBot)).is.empty;
  });

  it('picks a milestone the player also meets first', () => {
    const {human, marsBot} = setup();
    human.terraformRating = 35;
    const terraformer = new Terraformer();

    expect(MarsBotMilestoneAwardEval.selectMilestone(marsBot, [new Mayor(), terraformer])).eq(terraformer);
  });

  it('picks the milestone the player is fewest steps from next', () => {
    const {human, marsBot} = setup();
    addCity(human);
    const mayor = new Mayor();

    expect(MarsBotMilestoneAwardEval.selectMilestone(marsBot, [new Gardener(), mayor])).eq(mayor);
  });

  it('picks the leftmost milestone on a tie', () => {
    const {marsBot} = setup();
    const gardener = new Gardener();

    expect(MarsBotMilestoneAwardEval.selectMilestone(marsBot, [gardener, new Mayor()])).eq(gardener);
  });

  it('counts Hoverlord as rightmost', () => {
    const {human, marsBot} = setup();
    human.terraformRating = 35;
    const hoverlord = new Hoverlord();
    hoverlord.canClaim = () => true;
    const terraformer = new Terraformer();

    expect(MarsBotMilestoneAwardEval.selectMilestone(marsBot, [hoverlord, terraformer])).eq(terraformer);
  });

  it('picks nothing from no milestones', () => {
    const {marsBot} = setup();

    expect(MarsBotMilestoneAwardEval.selectMilestone(marsBot, [])).is.undefined;
  });

  it('claims the milestone it picks for MarsBot', () => {
    const {game, botPlayer, marsBot} = setup();
    const terraformer = new Terraformer();
    game.milestones = [terraformer, new Mayor()];
    botPlayer.terraformRating = 35;

    expect(MarsBotMilestoneAwardEval.maybeClaimMilestone(marsBot)).is.true;
    expect(game.claimedMilestones).deep.eq([{player: botPlayer, milestone: terraformer}]);
  });

  it('claims nothing when MarsBot meets no milestone', () => {
    const {game, marsBot} = setup();
    game.milestones = [new Terraformer(), new Mayor()];

    expect(MarsBotMilestoneAwardEval.maybeClaimMilestone(marsBot)).is.false;
    expect(game.claimedMilestones).is.empty;
  });

  it('pays 12 M€ for Briber', () => {
    const {game, marsBot, calls} = setup({megacredits: 20});
    game.milestones = [new Briber()];

    MarsBotMilestoneAwardEval.maybeClaimMilestone(marsBot);

    expect(calls).deep.eq(['loseMc(12)']);
  });

  for (const run of [
    {phase: Phase.ACTION, expected: {thermalist: 9, miner: 10}},
    {phase: Phase.END, expected: {thermalist: 9, miner: 10}},
  ]) {
    it("counts the player's resources plus production for Thermalist and Miner: " + JSON.stringify(run), () => {
      const [game, player] = testGame(2);
      player.heat = 2;
      player.energy = 3;
      player.steel = 1;
      player.titanium = 2;
      player.production.override({heat: 4, energy: 5, steel: 3, titanium: 4});
      game.phase = run.phase;

      expect(MarsBotMilestoneAwardEval.humanAwardScore(new Thermalist(), player)).eq(run.expected.thermalist);
      expect(MarsBotMilestoneAwardEval.humanAwardScore(new Miner(), player)).eq(run.expected.miner);
    });
  }

  it("uses the award's own score for the player otherwise", () => {
    const [/* game */, player] = testGame(2);
    player.production.override({megacredits: 6});

    expect(MarsBotMilestoneAwardEval.humanAwardScore(new Banker(), player)).eq(6);
  });

  it('funds the award MarsBot leads the player by the most', () => {
    const {game, human, botPlayer, marsBot} = setup({}, {Banker: 4, Thermalist: 6});
    const banker = new Banker();
    game.awards = [banker, new Thermalist()];
    human.heat = 3;

    expect(MarsBotMilestoneAwardEval.maybeFundAward(marsBot)).is.true;
    expect(game.fundedAwards).deep.eq([{player: botPlayer, award: banker}]);
  });

  it('funds nothing when MarsBot leads no award', () => {
    const {game, human, marsBot} = setup({}, {Banker: 2});
    game.awards = [new Banker()];
    human.production.override({megacredits: 2});

    expect(MarsBotMilestoneAwardEval.maybeFundAward(marsBot)).is.false;
    expect(game.fundedAwards).is.empty;
  });

  it('skips a funded award', () => {
    const {game, human, botPlayer, marsBot} = setup({}, {Banker: 6, Thermalist: 1});
    const [banker, thermalist] = [new Banker(), new Thermalist()];
    game.awards = [banker, thermalist];
    game.fundedAwards.push({player: human, award: banker});

    MarsBotMilestoneAwardEval.maybeFundAward(marsBot);

    expect(game.fundedAwards).deep.eq([{player: human, award: banker}, {player: botPlayer, award: thermalist}]);
  });

  it('funds nothing once all awards are funded', () => {
    const {game, human, marsBot} = setup({}, {Venuphile: 6});
    const awards = [new Banker(), new Thermalist(), new Miner()];
    game.awards = [...awards, new Venuphile()];
    for (const award of awards) {
      game.fundedAwards.push({player: human, award});
    }

    expect(MarsBotMilestoneAwardEval.maybeFundAward(marsBot)).is.false;
  });

  it('funds Venuphile only when no other award is tied with it', () => {
    const {game, botPlayer, marsBot} = setup({}, {Venuphile: 3, Banker: 3});
    const banker = new Banker();
    game.awards = [new Venuphile(), banker];

    MarsBotMilestoneAwardEval.maybeFundAward(marsBot);

    expect(game.fundedAwards).deep.eq([{player: botPlayer, award: banker}]);
  });
});
