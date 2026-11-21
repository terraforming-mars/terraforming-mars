import {expect} from 'chai';
import {Phase} from '@/common/Phase';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {
  getClaimableMilestones,
  humanAwardScore,
  marsBotCanClaimMilestone,
  maybeClaimMilestone,
  maybeFundAward,
  milestoneRemaining,
  selectMilestone,
} from '@/server/automa/MarsBotMilestoneAwardEval';
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

/** A bot that records its calls, with the award values in `awardValues`. */
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

      expect(marsBotCanClaimMilestone(new Briber(), marsBot)).eq(run.expected);
    });
  }

  for (const run of [
    {terraformRating: 34, expected: false},
    {terraformRating: 35, expected: true},
  ]) {
    it("runs the milestone against MarsBot's player otherwise: " + JSON.stringify(run), () => {
      const {botPlayer, marsBot} = setup();
      botPlayer.terraformRating = run.terraformRating;

      expect(marsBotCanClaimMilestone(new Terraformer(), marsBot)).eq(run.expected);
    });
  }

  for (const run of [
    {name: 'Mayor', cities: 1, megaCredits: 0, turmoil: false, expected: 2},
    {name: 'Mayor', cities: 4, megaCredits: 0, turmoil: false, expected: 0},
    {name: 'Terraformer', cities: 0, megaCredits: 0, turmoil: false, expected: 15},
    {name: 'Terraformer', cities: 0, megaCredits: 0, turmoil: true, expected: 6},
    {name: 'Briber', cities: 0, megaCredits: 0, turmoil: false, expected: Infinity},
    {name: 'Briber', cities: 0, megaCredits: 20, turmoil: false, expected: 0},
  ] as const) {
    it('counts how far the player is from a milestone: ' + JSON.stringify(run), () => {
      const [/* game */, player] = testGame(2, {turmoilExtension: run.turmoil});
      for (let city = 0; city < run.cities; city++) {
        addCity(player);
      }
      player.megaCredits = run.megaCredits;
      const milestone = run.name === 'Mayor' ? new Mayor() : run.name === 'Terraformer' ? new Terraformer() : new Briber();

      expect(milestoneRemaining(milestone, player)).eq(run.expected);
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

    expect(getClaimableMilestones(marsBot)).deep.eq([terraformer, hoverlord]);
  });

  it('lists no milestone once all are claimed', () => {
    const {game, human, botPlayer, marsBot} = setup();
    game.milestones = [new Terraformer(), new Mayor(), new Gardener(), new Hoverlord()];
    botPlayer.terraformRating = 35;
    for (const milestone of game.milestones.slice(1)) {
      game.claimedMilestones.push({player: human, milestone});
    }

    expect(getClaimableMilestones(marsBot)).is.empty;
  });

  it('picks a milestone the player also meets first', () => {
    const {human, marsBot} = setup();
    human.terraformRating = 35;

    expect(selectMilestone(marsBot, [new Mayor(), new Terraformer()])?.name).eq('Terraformer');
  });

  it('picks the milestone the player is closest to meeting next', () => {
    const {human, marsBot} = setup();
    addCity(human);

    expect(selectMilestone(marsBot, [new Gardener(), new Mayor()])?.name).eq('Mayor');
  });

  it('picks the leftmost milestone on a tie', () => {
    const {marsBot} = setup();

    expect(selectMilestone(marsBot, [new Gardener(), new Mayor()])?.name).eq('Gardener');
  });

  it('picks Hoverlord last', () => {
    const {human, marsBot} = setup();
    human.terraformRating = 35;
    const hoverlord = new Hoverlord();
    hoverlord.canClaim = () => true;

    expect(selectMilestone(marsBot, [hoverlord, new Terraformer()])?.name).eq('Terraformer');
  });

  it('picks nothing from no milestones', () => {
    const {marsBot} = setup();

    expect(selectMilestone(marsBot, [])).is.undefined;
  });

  it('claims the milestone it picks for MarsBot', () => {
    const {game, botPlayer, marsBot} = setup();
    game.milestones = [new Terraformer(), new Mayor()];
    botPlayer.terraformRating = 35;

    expect(maybeClaimMilestone(marsBot)).is.true;
    expect(game.claimedMilestones.map((claimed) => [claimed.player.id, claimed.milestone.name])).deep.eq([[botPlayer.id, 'Terraformer']]);
  });

  it('claims nothing when MarsBot meets no milestone', () => {
    const {game, marsBot} = setup();
    game.milestones = [new Terraformer(), new Mayor()];

    expect(maybeClaimMilestone(marsBot)).is.false;
    expect(game.claimedMilestones).is.empty;
  });

  it('pays 12 M€ for Briber', () => {
    const {game, marsBot, calls} = setup({megacredits: 20});
    game.milestones = [new Briber()];

    maybeClaimMilestone(marsBot);

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

      expect({thermalist: humanAwardScore(new Thermalist(), player), miner: humanAwardScore(new Miner(), player)})
        .deep.eq(run.expected);
    });
  }

  it("uses the award's own score for the player otherwise", () => {
    const [/* game */, player] = testGame(2);
    player.production.override({megacredits: 6});

    expect(humanAwardScore(new Banker(), player)).eq(6);
  });

  it('funds the award MarsBot leads the player by the most', () => {
    const {game, human, botPlayer, marsBot} = setup({}, {Banker: 4, Thermalist: 6});
    game.awards = [new Banker(), new Thermalist()];
    human.heat = 3;

    expect(maybeFundAward(marsBot)).is.true;
    expect(game.fundedAwards.map((funded) => [funded.player.id, funded.award.name])).deep.eq([[botPlayer.id, 'Banker']]);
  });

  it('funds nothing when MarsBot leads no award', () => {
    const {game, human, marsBot} = setup({}, {Banker: 2});
    game.awards = [new Banker()];
    human.production.override({megacredits: 2});

    expect(maybeFundAward(marsBot)).is.false;
    expect(game.fundedAwards).is.empty;
  });

  it('skips a funded award', () => {
    const {game, human, marsBot} = setup({}, {Banker: 6, Thermalist: 1});
    const [banker, thermalist] = [new Banker(), new Thermalist()];
    game.awards = [banker, thermalist];
    game.fundedAwards.push({player: human, award: banker});

    maybeFundAward(marsBot);

    expect(game.fundedAwards.map((funded) => funded.award.name)).deep.eq(['Banker', 'Thermalist']);
  });

  it('funds nothing once all awards are funded', () => {
    const {game, human, marsBot} = setup({}, {Venuphile: 6});
    const awards = [new Banker(), new Thermalist(), new Miner()];
    game.awards = [...awards, new Venuphile()];
    for (const award of awards) {
      game.fundedAwards.push({player: human, award});
    }

    expect(maybeFundAward(marsBot)).is.false;
  });

  it('funds Venuphile only when no other award is tied with it', () => {
    const {game, marsBot} = setup({}, {Venuphile: 3, Banker: 3});
    game.awards = [new Venuphile(), new Banker()];

    maybeFundAward(marsBot);

    expect(game.fundedAwards.map((funded) => funded.award.name)).deep.eq(['Banker']);
  });
});
