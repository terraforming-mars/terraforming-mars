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

type RecordingBot = {
  bot: IMarsBot;
  /** The corp handlers' calls into the bot, in order, as `name(arguments)`. */
  calls: Array<string>;
  corpState: Map<string, number>;
};

function recordingBot(): RecordingBot {
  const [game] = testGame(1);
  const calls: Array<string> = [];
  const corpState = new Map<string, number>();
  const record = (call: string) => {
    calls.push(call);
  };
  const bot = fakeMarsBot(THARSIS_MARSBOT_BOARD, {
    game,
    addFloaters: (count) => record(`addFloaters(${count})`),
    gainMc: (amount) => record(`gainMc(${amount})`),
    raiseTemperature: (steps) => record(`raiseTemperature(${steps})`),
    removeBonusCard: (id) => record(`removeBonusCard(${id})`),
    addBonusCardToBonusDeck: (id) => record(`addBonusCardToBonusDeck(${id})`),
    getCorpState: (key) => corpState.get(key) ?? 0,
    setCorpState: (key, value) => {
      corpState.set(key, value);
    },
  });
  return {bot, calls, corpState};
}

function corp(name: CardName): IMarsBotCorp {
  const found = AUTOMA_VENUS_MANIFEST.corps[name];
  if (found === undefined) {
    throw new Error(`${name} is not in the Venus manifest`);
  }
  return found;
}

describe('AutomaVenusManifest', () => {
  // C25: a blue card with a red arrow is an active card with an action
  it('Viron adds a floater and scores a VP for each active card with an action', () => {
    const {bot, calls} = recordingBot();
    const effect = corp(CardName.VIRON).effect!;

    effect.onProjectCardResolved!(bot, new Birds());
    effect.onProjectCardResolved!(bot, new Decomposers());

    expect(calls).deep.eq(['addFloaters(1)']);
    expect(effect.vpBonus!(bot)).eq(1);
  });

  // C26: the Round Start box (rulebook B p.3)
  it('Celestic adds a floater at setup, at round start and with each Failed Action', () => {
    const {bot, calls} = recordingBot();
    const celestic = corp(CardName.CELESTIC);

    celestic.setup!(bot);
    celestic.roundStart!(bot);
    celestic.effect!.onFailedAction!(bot);

    expect(calls).deep.eq(['addFloaters(1)', 'addFloaters(1)', 'addFloaters(1)']);
  });

  // C34: the Round Start box (rulebook B p.3)
  it('Stormcraft adds a floater at setup and at round start, and raises the temperature when floaters keep an extra card', () => {
    const {bot, calls} = recordingBot();
    const stormcraft = corp(CardName.STORMCRAFT_INCORPORATED);

    stormcraft.setup!(bot);
    stormcraft.roundStart!(bot);
    stormcraft.effect!.onFloatersSpentForExtraCard!(bot);

    expect(calls).deep.eq(['addFloaters(1)', 'addFloaters(1)', 'raiseTemperature(1)']);
  });

  // C27: with Venus Next the bonus deck's Lobbyists is B15 (rulebook B p.1)
  it('Morning Star swaps Lobbyists for Venusian Lobby at setup', () => {
    const {bot, calls} = recordingBot();

    corp(CardName.MORNING_STAR_INC).setup!(bot);

    expect(calls).deep.eq(['removeBonusCard(B06)', 'removeBonusCard(B15)', 'addBonusCardToBonusDeck(B26)']);
  });

  // The cubes on the Venus track (rulebook B p.3)
  it('Morning Star silver resource cubes sit on the Venus track at the spaces its card names', () => {
    const board = new MarsBotBoard([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);

    const placed = corpTrackCubes(corp(CardName.MORNING_STAR_INC), board)
      .map((cube) => `${board.definitions[cube.trackIndex].tags[0]} ${cube.cubeType} ${cube.position}`);

    expect(placed).deep.eq([5, 6, 7, 8, 9, 11, 12].map((position) => `venus credit ${position}`));
  });

  it('Morning Star gains 5 M€ for a silver resource cube', () => {
    const {bot, calls} = recordingBot();

    corp(CardName.MORNING_STAR_INC).effect!.onTrackCubeTrigger!(bot, 7, 5, 'credit');

    expect(calls).deep.eq(['gainMc(5)']);
  });

  // C28
  it('Aphrodite gains 2 M€ for each step Venus is raised', () => {
    const {bot, calls} = recordingBot();

    corp(CardName.APHRODITE).effect!.onVenusRaised!(bot, 3);

    expect(calls).deep.eq(['gainMc(6)']);
  });
});
