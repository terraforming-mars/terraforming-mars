import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {fakeMarsBot} from '../FakeMarsBot';
import {CardName} from '../../../src/common/cards/CardName';
import {IMarsBot} from '../../../src/server/automa/IMarsBot';
import {IMarsBotCorp} from '../../../src/server/automa/IMarsBotCorp';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '../../../src/server/automa/boards/VenusMarsBot';
import {corpTrackCubes} from '../../../src/server/automa/corpTrackCubes';
import {AUTOMA_VENUS_MANIFEST} from '../../../src/server/automa/corps/AutomaVenusManifest';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';

/** A bot that records the corp handlers' calls, in order, as `name(arguments)`. */
function recordingBot(): {bot: IMarsBot, calls: Array<string>} {
  const [game] = testGame(1);
  const calls: Array<string> = [];
  const corpState = new Map<string, number>();
  const marsBot = fakeMarsBot({
    game,
    addFloaters: (count) => calls.push(`addFloaters(${count})`),
    gainMc: (amount) => calls.push(`gainMc(${amount})`),
    raiseTemperature: (steps) => calls.push(`raiseTemperature(${steps})`),
    removeBonusCard: (id) => calls.push(`removeBonusCard(${id})`),
    addBonusCardToBonusDeck: (id) => calls.push(`addBonusCardToBonusDeck(${id})`),
    getCorpState: (key) => corpState.get(key) ?? 0,
    setCorpState: (key, value) => corpState.set(key, value),
  });
  return {bot: marsBot, calls};
}

const corp = (name: CardName): IMarsBotCorp => AUTOMA_VENUS_MANIFEST.corps[name]!;

describe('AutomaVenusManifest', () => {
  // C25: a blue card with a red arrow is an active card with an action
  it('Viron adds a floater and scores a VP for each active card with an action', () => {
    const {bot: marsBot, calls} = recordingBot();
    const effect = corp(CardName.VIRON).effect!;

    effect.onProjectCardResolved!(marsBot, new Birds());
    effect.onProjectCardResolved!(marsBot, new Decomposers());

    expect(calls).deep.eq(['addFloaters(1)']);
    expect(effect.vpBonus!(marsBot)).eq(1);
  });

  // The Setup and Round Start boxes (rulebook B p.1, p.3), then the effect
  type Hook = (c: IMarsBotCorp) => ((marsBot: IMarsBot, ...args: Array<number>) => void) | undefined;
  const runs: Array<{name: CardName, hooks: Array<Hook>, calls: Array<string>}> = [
    {
      name: CardName.CELESTIC,
      hooks: [(c) => c.setup, (c) => c.roundStart, (c) => c.effect!.onFailedAction],
      calls: ['addFloaters(1)', 'addFloaters(1)', 'addFloaters(1)'],
    },
    {
      name: CardName.STORMCRAFT_INCORPORATED,
      hooks: [(c) => c.setup, (c) => c.roundStart, (c) => c.effect!.onFloatersSpentForExtraCard],
      calls: ['addFloaters(1)', 'addFloaters(1)', 'raiseTemperature(1)'],
    },
    {name: CardName.APHRODITE, hooks: [(c) => c.effect!.onVenusRaised], calls: ['gainMc(6)']},
  ];
  for (const run of runs) {
    it(`${run.name}: ${run.calls.join(', ')}`, () => {
      const {bot: marsBot, calls} = recordingBot();

      // Aphrodite reads the 3 steps Venus is raised, the other hooks ignore them
      run.hooks.forEach((hook) => hook(corp(run.name))!(marsBot, 3));

      expect(calls).deep.eq(run.calls);
    });
  }

  // With Venus Next the bonus deck's Lobbyists is B15. Its silver resource cubes sit on the Venus track (rulebook B p.3)
  it('Morning Star swaps Lobbyists for Venusian Lobby, and its silver resource cubes pay 5 M€', () => {
    const {bot: marsBot, calls} = recordingBot();
    const morningStar = corp(CardName.MORNING_STAR_INC);
    const board = new MarsBotBoard([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);

    morningStar.setup!(marsBot);
    morningStar.effect!.onTrackCubeTrigger!(marsBot, 7, 5, 'credit');

    expect(calls).deep.eq(['removeBonusCard(B06)', 'removeBonusCard(B15)', 'addBonusCardToBonusDeck(B26)', 'gainMc(5)']);
    expect(corpTrackCubes(morningStar, board).map((cube) => `${board.definitions[cube.trackIndex].tags[0]} ${cube.cubeType} ${cube.position}`))
      .deep.eq([5, 6, 7, 8, 9, 11, 12].map((position) => `venus credit ${position}`));
  });
});
