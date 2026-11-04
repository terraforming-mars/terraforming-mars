import {Tag} from '../../common/cards/Tag';
import {CubeType} from '../../common/automa/AutomaTypes';
import {GlobalParameter} from '../../common/GlobalParameter';
import {TileType} from '../../common/TileType';
import {IProjectCard} from '../cards/IProjectCard';
import {IMarsBot} from './IMarsBot';
import {Space} from '../boards/Space';

/** How the bot picks a card in the research draft. Each corp names one priority. */
export type MarsBotDraftPriority =
  | { type: 'tags'; tags: Array<Tag> }
  | { type: 'mostExpensive' }
  | { type: 'leastAdvancedTrack' }
  | { type: 'mostTags' };

/** A cube on the corp's track, including its type and position within a track. */
export type MarsBotTrackCube = {
  trackIndex: number;
  position: number;
  cubeType: CubeType;
};

/**
 * A corp cube printed on the track of a tag (Aridor's "Jovian track #6"), wherever that tag's
 * track sits on the map's MarsBot board.
 */
export type MarsBotTagTrackCube = {
  trackTag: Tag;
  position: number;
  cubeType: CubeType;
};

export type MarsBotCorpEffect = {
  /**
   * The bot's track marker reached one of this corp's cubes.
   *
   * Cube effects come on top of the icon printed on that space unless the corp's card says
   * otherwise: return true when the cube's effect replaces the icon (Helion's white cubes draw
   * a card instead of the temperature step under them), and the icon is then left unresolved.
   */
  onTrackCubeTrigger?(bot: IMarsBot, trackIndex: number, position: number, cubeType: CubeType): boolean | void;
  /**
   * The bot's track reached `position` and that space finished resolving, its icon included.
   *
   * Not called when the track moves back onto a space it regressed from.
   */
  afterTrackSpaceResolved?(bot: IMarsBot, trackIndex: number, position: number): void;
  /** The bot resolved a tag, on a project card or as one of its corp's starting tags. */
  onTagResolved?(bot: IMarsBot, tag: Tag): void;
  /** The bot drew and resolved a project card. */
  onProjectCardResolved?(bot: IMarsBot, card: IProjectCard): void;
  /** The human player played a card. */
  onHumanCardPlayed?(bot: IMarsBot, card: IProjectCard): void;
  /** A tile landed on `space`, placed by either side. */
  onTilePlaced?(bot: IMarsBot, placedByMarsBot: boolean, tileType: TileType, space: Space): void;
  /** Called after either player raises Venus, with the number of steps it actually moved. */
  onVenusRaised?(bot: IMarsBot, steps: number): void;
  /** Called before the bot raises a global parameter. Returning true cancels that raise: the global parameter stays at its current value. */
  interceptGlobalParameterRaise?(bot: IMarsBot, parameter: GlobalParameter): boolean;
  /** The bot's M€ supply just grew by this amount. */
  onMcGained?(bot: IMarsBot, amount: number): void;
  /** Either player built a colony (Poseidon, C33). */
  onColonyPlaced?(bot: IMarsBot): void;
  /** The bot took a Failed Action, after gaining its M€ for it. */
  onFailedAction?(bot: IMarsBot): void;
  /** The bot spent floaters to keep an extra card in the research phase. */
  onFloatersSpentForExtraCard?(bot: IMarsBot): void;
  /** Extra victory points added at final scoring. */
  vpBonus?(bot: IMarsBot): number;
  /** Points added to the bot's score in every award, when funding one and at final scoring. */
  awardScoreBonus?(bot: IMarsBot): number;
};
