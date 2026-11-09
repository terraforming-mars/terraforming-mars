import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {fakeMarsBot} from '../FakeMarsBot';
import {CardName} from '../../../src/common/cards/CardName';
import {TileType} from '../../../src/common/TileType';
import {DELEGATES_PER_PLAYER} from '../../../src/common/constants';
import {GlobalParameter} from '../../../src/common/GlobalParameter';
import {IMarsBot} from '../../../src/server/automa/IMarsBot';
import {IMarsBotCorp} from '../../../src/server/automa/IMarsBotCorp';
import {AUTOMA_TURMOIL_MANIFEST} from '../../../src/server/automa/corps/AutomaTurmoilManifest';

type RecordingBot = {
  bot: IMarsBot;
  /** The corp handlers' calls into the bot, in order, as `name(arguments)`. */
  calls: Array<string>;
  corpState: Map<string, number>;
};

type RecordingBotOptions = {
  generation?: number;
  turmoil?: boolean;
  /** Runs after the fake `advanceTrack` moved the marker, for the M€ a real advance can earn. */
  onAdvance?: (trackIndex: number) => void;
};

function recordingBot(options: RecordingBotOptions = {}): RecordingBot {
  const [game] = testGame(1, {automa: true, turmoilExtension: options.turmoil});
  game.generation = options.generation ?? 1;
  const calls: Array<string> = [];
  const corpState = new Map<string, number>();
  const record = (call: string) => {
    calls.push(call);
  };
  const marsBot: IMarsBot = fakeMarsBot({
    game,
    player: game.marsBotPlayer,
    megacredits: 0,
    gainMc: (amount) => record(`gainMc(${amount})`),
    raiseTR: (steps) => record(`raiseTR(${steps})`),
    advanceTrack: (trackIndex) => {
      record(`advanceTrack(${trackIndex})`);
      options.onAdvance?.(trackIndex);
    },
    removeBonusCard: (id) => record(`removeBonusCard(${id})`),
    addBonusCardToActionDeck: (id) => record(`addBonusCardToActionDeck(${id})`),
    addBonusCardToBonusDeck: (id) => record(`addBonusCardToBonusDeck(${id})`),
    drawProjectCardsToActionDeck: (count) => record(`drawProjectCardsToActionDeck(${count})`),
    getCorpState: (key) => corpState.get(key) ?? 0,
    setCorpState: (key, value) => {
      corpState.set(key, value);
    },
  });
  return {bot: marsBot, calls, corpState};
}

function corp(name: CardName): IMarsBotCorp {
  const found = AUTOMA_TURMOIL_MANIFEST.corps[name];
  if (found === undefined) {
    throw new Error(`${name} is not in the Turmoil manifest`);
  }
  return found;
}

// Track index on the Tharsis board
const BUILDING = 0;

describe('AutomaTurmoilManifest', () => {
  it('has five corporations', () => {
    expect(Object.entries(AUTOMA_TURMOIL_MANIFEST.corps)).to.have.length(5);
  });

  for (const [name, found] of Object.entries(AUTOMA_TURMOIL_MANIFEST.corps)) {
    it(`keys ${name} by its own name`, () => {
      expect(found.name).eq(name);
    });
  }

  it('Septem Tribus needs Turmoil', () => {
    expect(corp(CardName.SEPTUM_TRIBUS).requiredExpansions).deep.eq(['turmoil']);
  });

  // C35 Lakefront Resorts
  it('Lakefront Resorts setup puts a white cube on the card and pays 3 M€ per adjacent ocean', () => {
    const {bot: marsBot, corpState} = recordingBot();

    corp(CardName.LAKEFRONT_RESORTS).setup!(marsBot);

    expect(corpState.get('whiteCubeOnCard')).eq(1);
    expect(marsBot.player.oceanBonus).eq(3);
  });

  it('Lakefront Resorts oceans alternate between taking the cube off to advance the building track and putting it back', () => {
    const {bot: marsBot, calls, corpState} = recordingBot();
    const effect = corp(CardName.LAKEFRONT_RESORTS).effect!;
    const space = marsBot.game.board.spaces[0];
    corpState.set('whiteCubeOnCard', 1);

    effect.onTilePlaced!(marsBot, false, TileType.OCEAN, space);
    expect(corpState.get('whiteCubeOnCard')).eq(0);
    expect(calls).deep.eq([`advanceTrack(${BUILDING})`]);

    effect.onTilePlaced!(marsBot, false, TileType.GREENERY, space);
    expect(corpState.get('whiteCubeOnCard')).eq(0);

    effect.onTilePlaced!(marsBot, true, TileType.OCEAN, space);
    expect(corpState.get('whiteCubeOnCard')).eq(1);
    expect(calls).deep.eq([`advanceTrack(${BUILDING})`]);
  });

  // FAQ (rulebook B p.4): Lakefront overrides Government Intervention's "no M€"
  it('Lakefront Resorts keeps the M€ its building track advance earns during Government Intervention', () => {
    const {bot: marsBot, corpState} = recordingBot({onAdvance: () => {
      marsBot.megacredits += 4;
    }});
    corpState.set('whiteCubeOnCard', 1);
    marsBot.mcKeptThroughIntervention = 0;

    corp(CardName.LAKEFRONT_RESORTS).effect!.onTilePlaced!(marsBot, false, TileType.OCEAN, marsBot.game.board.spaces[0]);

    expect(marsBot.mcKeptThroughIntervention).eq(4);
  });

  // C36 Pristar
  it('Pristar skips the first raise of a global parameter for 1 TR and 6 M€, and lets the next one through', () => {
    const {bot: marsBot, calls, corpState} = recordingBot();
    const effect = corp(CardName.PRISTAR).effect!;
    corpState.set('whiteCubeOnCard', 1);

    expect(effect.interceptGlobalParameterRaise!(marsBot, GlobalParameter.TEMPERATURE)).is.true;
    expect(corpState.get('whiteCubeOnCard')).eq(0);
    expect(calls).deep.eq(['raiseTR(1)', 'gainMc(6)']);

    expect(effect.interceptGlobalParameterRaise!(marsBot, GlobalParameter.OXYGEN)).is.false;
    expect(calls).deep.eq(['raiseTR(1)', 'gainMc(6)']);
  });

  it('Pristar puts the cube back before the action phase', () => {
    const {bot: marsBot, corpState} = recordingBot();
    corpState.set('whiteCubeOnCard', 0);

    corp(CardName.PRISTAR).beforeActionPhase!(marsBot);

    expect(corpState.get('whiteCubeOnCard')).eq(1);
  });

  // C37 Septem Tribus
  it('Septem Tribus setup swaps Party Politics for Gray Eminence and adds the delegates of an unused colour to MarsBot', () => {
    const {bot: marsBot, calls} = recordingBot({turmoil: true});

    corp(CardName.SEPTUM_TRIBUS).setup!(marsBot);

    expect(calls).deep.eq(['removeBonusCard(B21)', 'addBonusCardToBonusDeck(B29)']);
    expect(marsBot.game.turmoil!.delegateReserve.get(marsBot.player)).eq(2 * DELEGATES_PER_PLAYER);
  });

  for (const run of [
    {name: CardName.SEPTUM_TRIBUS, bonusCard: 'B29'},
    {name: CardName.UTOPIA_INVEST, bonusCard: 'B32'},
  ]) {
    it(`${run.name} adds ${run.bonusCard} to the action deck`, () => {
      const {bot: marsBot, calls} = recordingBot();

      corp(run.name).beforeActionPhase!(marsBot);

      expect(calls).deep.eq([`addBonusCardToActionDeck(${run.bonusCard})`]);
    });
  }

  // C38 Terralabs
  it('Terralabs Research setup takes 8 TR off MarsBot', () => {
    const {bot: marsBot, calls} = recordingBot();

    corp(CardName.TERRALABS_RESEARCH).setup!(marsBot);

    expect(calls).deep.eq(['raiseTR(-8)']);
  });

  for (const run of [
    {generation: 8, count: 1},
    {generation: 9, count: 2},
  ]) {
    it(`Terralabs Research draws ${run.count} card(s) to the action deck in generation ${run.generation}`, () => {
      const {bot: marsBot, calls} = recordingBot({generation: run.generation});

      corp(CardName.TERRALABS_RESEARCH).beforeActionPhase!(marsBot);

      expect(calls).deep.eq([`drawProjectCardsToActionDeck(${run.count})`]);
    });
  }
});
