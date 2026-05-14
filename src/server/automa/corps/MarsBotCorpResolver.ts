import {IMarsBotCorp, trackCubeKey} from '../MarsBotCorpTypes';
import {CardName} from '../../../common/cards/CardName';
import {Random} from '../../../common/utils/Random';
import {getAllMarsBotCorps} from './MarsBotCorpRegistry';
import type {MarsBot} from '../MarsBot';

/**
 * Orchestrates MarsBot corporation lifecycle: selection, setup, cube triggers, per-gen effects.
 */
export class MarsBotCorpResolver {
  public static selectCorp(humanCorpName: CardName, rng: Random): IMarsBotCorp {
    const allCorps = getAllMarsBotCorps();
    const eligible = allCorps.filter((c) => c.name !== humanCorpName);
    if (eligible.length === 0) {
      throw new Error('No MarsBot corps registered');
    }
    return eligible[rng.nextInt(eligible.length)];
  }

  /**
   * Run corp setup: place track cubes, resolve starting tags, call setup box.
   */
  public static setupCorp(corp: IMarsBotCorp, marsBot: MarsBot): void {
    // 1. Place track cubes
    if (corp.trackCubes !== undefined) {
      for (const cube of corp.trackCubes) {
        marsBot.trackCubePositions.set(trackCubeKey(cube.trackIndex, cube.position), cube);
      }
    }

    // 2. Resolve starting tags — advance tracks like project card tags
    for (const tag of corp.startingTags) {
      const trackIndex = marsBot.board.getTrackIndexForTag(tag);
      if (trackIndex !== undefined) {
        marsBot.turnResolver.advanceTrack(trackIndex);
      }
    }

    // 2b. FAQ: trigger human corp callbacks for MarsBot's starting tags
    // e.g., if human plays Saturn Systems and MarsBot has Jovian starting tag
    if (corp.startingTags.length > 0) {
      const humanPlayer = marsBot.humanPlayer;
      const fakeCard = {tags: [...corp.startingTags], name: corp.name} as any;
      for (const effectCard of humanPlayer.playedCards) {
        humanPlayer.defer(effectCard.onCardPlayedByAnyPlayer?.(humanPlayer, fakeCard, marsBot.player));
      }
    }

    // 3. Call corp-specific setup
    if (corp.setup !== undefined) {
      corp.setup.resolve(marsBot.getCorpContext());
    }
  }

  /**
   * Called when a track advances to a new position. Checks for cube triggers.
   */
  public static onTrackAdvanced(marsBot: MarsBot, trackIndex: number, position: number): void {
    const cube = marsBot.hasCubeAt(trackIndex, position);
    if (cube === undefined) return;
    if (marsBot.isCubeTriggered(trackIndex, position)) return;

    marsBot.markCubeTriggered(trackIndex, position);

    // Corp cube trigger
    const corp = marsBot.corp;
    if (corp !== undefined) {
      corp.effect?.onTrackCubeTrigger?.(marsBot.getCorpContext(), trackIndex, position, cube.cubeType);
    }

    // Colony cubes (Pioneer4/Constructor): positions set by AutomaGameSetup
    if (marsBot.hasColonyCubes && marsBot.colonyCubePositions.has(trackCubeKey(trackIndex, position))) {
      const cost = 5;
      marsBot.turnResolver.mcSupply = Math.max(0, marsBot.turnResolver.mcSupply - cost);
      marsBot.game.log('MarsBot loses ${0} MC and builds a colony', (b) => b.number(cost));
    }
  }

  /**
   * Resolve per-generation effect for the corp.
   */
  public static resolvePerGenEffect(corp: IMarsBotCorp, marsBot: MarsBot): void {
    if (corp.perGeneration !== undefined) {
      corp.perGeneration.resolve(marsBot.getCorpContext());
    }
  }
}
