import {Tag} from '../../common/cards/Tag';
import {
  TrackAction,
  TrackDefinition,
  MARSBOT_MAX_TRACK_POSITION,
} from '../../common/automa/AutomaTypes';

/** Result of advancing a track. */
export type AdvanceResult =
  | {type: 'action', action: TrackAction}
  | {type: 'none'}
  | {type: 'maxed'};

/** Runtime state for a single MarsBot track. */
export class MarsBotTrack {
  public position: number = 0;
  /** Positions that were regressed from and not yet re-advanced to. Actions on these are skipped. */
  public regressedPositions: Set<number> = new Set();

  constructor(public readonly definition: TrackDefinition) {}

  public canAdvance(): boolean {
    return this.position < MARSBOT_MAX_TRACK_POSITION;
  }

  /** Advance the track by 1. */
  public advance(): AdvanceResult {
    if (!this.canAdvance()) {
      return {type: 'maxed'};
    }
    this.position++;
    if (this.regressedPositions.has(this.position)) {
      this.regressedPositions.delete(this.position);
      return {type: 'none'};
    }
    const action = this.definition.layout[this.position];
    return action !== undefined ? {type: 'action', action} : {type: 'none'};
  }

  /** Regress the track by 1 (from human decreasing MarsBot production). */
  public regress(): void {
    if (this.position > 0) {
      this.regressedPositions.add(this.position);
      this.position--;
    }
  }

  /** Get the action at the next position without advancing. Returns undefined if at max or no action. */
  public peek(): TrackAction | undefined {
    if (!this.canAdvance()) return undefined;
    return this.definition.layout[this.position + 1];
  }
}

/** The MarsBot board with tracks. Handles tag-to-track mapping and track state. */
export class MarsBotBoard {
  public readonly tracks: ReadonlyArray<MarsBotTrack>;
  private readonly tagToTrack: Map<Tag, number>;

  constructor(public readonly data: ReadonlyArray<TrackDefinition>) {
    this.tracks = data.map((def) => new MarsBotTrack(def));
    this.tagToTrack = new Map();
    for (let i = 0; i < data.length; i++) {
      for (const tag of data[i].tags) {
        this.tagToTrack.set(tag, i);
      }
    }
  }

  public getTrackIndexForTag(tag: Tag): number | undefined {
    return this.tagToTrack.get(tag);
  }

  /** Check if a tag is mapped to any track. */
  public hasTrackForTag(tag: Tag): boolean {
    return this.tagToTrack.has(tag);
  }

  /** Index of the least-advanced track (first index if tied). */
  public getLeastAdvancedTrackIndex(): number {
    let minPos = this.tracks[0].position;
    let minIndex = 0;
    for (let i = 1; i < this.tracks.length; i++) {
      if (this.tracks[i].position < minPos) {
        minPos = this.tracks[i].position;
        minIndex = i;
      }
    }
    return minIndex;
  }

  /** Index of the most-advanced track (first index if tied). */
  public getMostAdvancedTrackIndex(): number {
    let maxPos = this.tracks[0].position;
    let maxIndex = 0;
    for (let i = 1; i < this.tracks.length; i++) {
      if (this.tracks[i].position > maxPos) {
        maxPos = this.tracks[i].position;
        maxIndex = i;
      }
    }
    return maxIndex;
  }

  /** Index of the most-advanced track that hasn't reached max, or undefined if all maxed. */
  public getMostAdvancedNonMaxedTrackIndex(): number | undefined {
    let maxPos = -1;
    let maxIndex: number | undefined;
    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].position > maxPos && this.tracks[i].canAdvance()) {
        maxPos = this.tracks[i].position;
        maxIndex = i;
      }
    }
    return maxIndex;
  }
}
