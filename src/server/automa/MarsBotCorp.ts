import {CardName} from '../../common/cards/CardName';
import {Tag} from '../../common/cards/Tag';
import {CubeType} from '../../common/automa/AutomaTypes';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {Expansion} from '../../common/cards/GameModule';
import {GlobalParameter} from '../../common/GlobalParameter';
import {TileType} from '../../common/TileType';
import {Space} from '../boards/Space';
import {IProjectCard} from '../cards/IProjectCard';
import {IMarsBot} from './IMarsBot';
import {MarsBotDraftPriority, MarsBotTagTrackCube, MarsBotTrackCube} from './MarsBotCorpTypes';

export type MarsBotCorpProperties =
  Pick<MarsBotCorp, 'name' | 'description'> &
  Partial<Pick<MarsBotCorp, 'tags' | 'requiredExpansions' | 'draftPriority' | 'actionDeckBonusCard' | 'trackCubes' | 'trackCubesTriggerEveryAdvance'>>;

/**
 * A corporation MarsBot plays.
 *
 * A corporation overrides the hooks its card uses and leaves the rest undefined. It keeps no state of its own:
 * one instance serves every game, so what a corporation tracks lives on the bot.
 */
export abstract class MarsBotCorp {
  /** The corporation card this bot corp stands in for. */
  public readonly name: CardName;
  /** Rules summary shown to the human player. */
  public readonly description: string;
  /** Tags printed on the corp card, which count toward the bot's tag totals for the whole game. */
  public readonly tags: ReadonlyArray<Tag>;
  /** Expansions the corp card is marked with, at least one of which must be in play for the bot to draw it. */
  public readonly requiredExpansions?: ReadonlyArray<Expansion>;
  public readonly draftPriority?: MarsBotDraftPriority;
  /**
   * The bonus card this corp puts in the action deck every generation.
   *
   * The card lives outside the bonus deck: after it resolves it waits for the next generation.
   * Once its removal condition removes it (Vitor's Overachievement), it stays out of the game.
   */
  public readonly actionDeckBonusCard?: BonusCardName;
  /** Cubes seeded onto the bot's board tracks during setup, read through `corpTrackCubes`. */
  public readonly trackCubes?: ReadonlyArray<MarsBotTrackCube | MarsBotTagTrackCube>;
  /**
   * True when the corp's cubes trigger on every advance onto their space, not only the first.
   *
   * The whole-track white cubes of the corps that pay "whenever advancing" on a track. After a
   * regression the space's icon still stays unresolved.
   */
  public readonly trackCubesTriggerEveryAdvance?: boolean;

  constructor(properties: MarsBotCorpProperties) {
    this.name = properties.name;
    this.description = properties.description;
    this.tags = properties.tags ?? [];
    this.requiredExpansions = properties.requiredExpansions;
    this.draftPriority = properties.draftPriority;
    this.actionDeckBonusCard = properties.actionDeckBonusCard;
    this.trackCubes = properties.trackCubes;
    this.trackCubesTriggerEveryAdvance = properties.trackCubesTriggerEveryAdvance;
  }

  /** Runs once, right after the bot's corporation is chosen. */
  public setup?(marsBot: IMarsBot): void;
  /** Called at the start of every generation. */
  public roundStart?(marsBot: IMarsBot): void;
  /** Called every generation, right before the action phase. */
  public beforeActionPhase?(marsBot: IMarsBot): void;
  /**
   * Called when the bot's track marker reaches one of this corp's cubes.
   *
   * Cube effects come on top of the icon printed on that space unless the corp's card says
   * otherwise: return true when the cube's effect replaces the icon (Helion's white cubes draw
   * a card instead of the temperature step under them), and the icon is then left unresolved.
   */
  public onTrackCubeTrigger?(marsBot: IMarsBot, trackIndex: number, position: number, cubeType: CubeType): boolean | void;
  /**
   * Called after the bot's track reaches `position` and that space finishes resolving, its icon included.
   *
   * Not called when the track moves back onto a space it regressed from.
   */
  public afterTrackSpaceResolved?(marsBot: IMarsBot, trackIndex: number, position: number): void;
  /** Called when the bot resolves a tag, on a project card or as one of its corp's starting tags. */
  public onTagResolved?(marsBot: IMarsBot, tag: Tag): void;
  /** Called when the bot draws and resolves a project card. */
  public onProjectCardResolved?(marsBot: IMarsBot, card: IProjectCard): void;
  /** Called when the human player plays a card. */
  public onHumanCardPlayed?(marsBot: IMarsBot, card: IProjectCard): void;
  /** Called when either side places a tile on `space`. */
  public onTilePlaced?(marsBot: IMarsBot, placedByMarsBot: boolean, tileType: TileType, space: Space): void;
  /** Called after either player raises Venus, with the number of steps it actually moved. */
  public onVenusRaised?(marsBot: IMarsBot, steps: number): void;
  /**
   * Called before the bot raises a global parameter.
   *
   * Returning true cancels that raise: the global parameter stays at its current value.
   */
  public interceptGlobalParameterRaise?(marsBot: IMarsBot, parameter: GlobalParameter): boolean;
  /** Called after the bot's M€ supply grows by `amount`. */
  public onMcGained?(marsBot: IMarsBot, amount: number): void;
  /** Called when either player builds a colony (Poseidon, C33). */
  public onColonyPlaced?(marsBot: IMarsBot): void;
  /** Called when the bot takes a Failed Action, after it gains its M€ for it. */
  public onFailedAction?(marsBot: IMarsBot): void;
  /** Called when the bot spends floaters to keep an extra card in the research phase. */
  public onFloatersSpentForExtraCard?(marsBot: IMarsBot): void;
  /** Extra victory points added at final scoring. */
  public vpBonus?(marsBot: IMarsBot): number;
  /** Points added to the bot's score in every award, when funding one and at final scoring. */
  public awardScoreBonus?(marsBot: IMarsBot): number;
}
