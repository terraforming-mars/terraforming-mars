import {CardName} from '../../common/cards/CardName';
import {Tag} from '../../common/cards/Tag';
import {BonusCardId} from '../../common/automa/AutomaTypes';
import {Expansion} from '../../common/cards/GameModule';
import {IMarsBot} from './IMarsBot';
import {MarsBotCorpEffect, MarsBotDraftPriority, MarsBotTagTrackCube, MarsBotTrackCube} from './MarsBotCorpTypes';

export type IMarsBotCorp = {
  /** The corporation card this bot corp stands in for. */
  readonly name: CardName;
  /** Rules summary shown to the human player. */
  readonly description: string;
  /** Tags printed on the corp card. They count toward the bot's tag totals for the whole game. */
  readonly tags: ReadonlyArray<Tag>;
  /** Expansions the corp card is marked with. The bot only draws it when at least one of them is in play. */
  readonly requiredExpansions?: ReadonlyArray<Expansion>;
  readonly draftPriority?: MarsBotDraftPriority;
  /** Runs once, right after the bot's corporation is chosen. */
  setup?(bot: IMarsBot): void;
  readonly effect?: MarsBotCorpEffect;
  /** A corp action taken at the start of every generation. */
  roundStart?(bot: IMarsBot): void;
  /** A corp action taken every generation, right before the action phase. */
  beforeActionPhase?(bot: IMarsBot): void;
  /**
   * The bonus card this corp puts in the action deck every generation.
   *
   * The card lives outside the bonus deck: after it resolves it waits for the next generation.
   * Once its removal condition removes it (Vitor's Overachievement), it stays out of the game.
   */
  readonly actionDeckBonusCard?: BonusCardId;
  /** Cubes seeded onto the bot's board tracks during setup. Read them through corpTrackCubes. */
  readonly trackCubes?: ReadonlyArray<MarsBotTrackCube | MarsBotTagTrackCube>;
  /**
   * True when the corp's cubes trigger on every advance onto their space, not only the first.
   *
   * The whole-track white cubes of the corps that pay "whenever advancing" on a track. After a
   * regression the space's icon still stays unresolved.
   */
  readonly trackCubesTriggerEveryAdvance?: boolean;
};

/** Corp state key, set to 1 once the corp's `actionDeckBonusCard` removed itself from the game. */
export const ACTION_DECK_BONUS_CARD_REMOVED = 'actionDeckBonusCardRemoved';
