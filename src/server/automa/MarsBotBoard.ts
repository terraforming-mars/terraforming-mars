import {Tag} from '../../common/cards/Tag';
import {
  TrackAction,
  TrackDefinition,
  MarsBotBoardData,
  MARSBOT_MAX_TRACK_POSITION,
} from '../../common/automa/AutomaTypes';

/** Runtime state for a single MarsBot track. */
export class MarsBotTrack {
  public position: number = 0;
  /** Positions that were regressed from and not yet re-advanced to. Actions on these are skipped. */
  public regressedPositions: Set<number> = new Set();

  constructor(public readonly definition: TrackDefinition) {}

  public canAdvance(): boolean {
    return this.position < MARSBOT_MAX_TRACK_POSITION;
  }

  /** Advance the track by 1. Returns the action at the new position, or null. */
  public advance(): TrackAction | null {
    if (!this.canAdvance()) {
      return null; // Caller should trigger failed action
    }
    this.position++;
    // If this position was previously regressed from, clear the marker and skip the action
    if (this.regressedPositions.has(this.position)) {
      this.regressedPositions.delete(this.position);
      return null;
    }
    return this.definition.layout[this.position] ?? null;
  }

  /** Regress the track by 1 (from human decreasing MarsBot production). */
  public regress(): void {
    if (this.position > 0) {
      this.regressedPositions.add(this.position);
      this.position--;
    }
  }

  /** Get the action at the NEXT position (for final greenery check). */
  public peekNextAction(): TrackAction | null {
    if (this.position >= MARSBOT_MAX_TRACK_POSITION) return null;
    return this.definition.layout[this.position + 1] ?? null;
  }
}

/** The MarsBot board with 7 tracks. Handles tag-to-track mapping and track state. */
export class MarsBotBoard {
  public readonly tracks: ReadonlyArray<MarsBotTrack>;
  private readonly tagToTrack: Map<Tag, number>; // Tag → track index (0-based)

  constructor(public readonly data: MarsBotBoardData) {
    this.tracks = data.trackDefs.map((def) => new MarsBotTrack(def));
    this.tagToTrack = new Map();
    for (let i = 0; i < data.trackDefs.length; i++) {
      for (const tag of data.trackDefs[i].tags) {
        this.tagToTrack.set(tag, i);
      }
    }
  }

  /** Get the track index (0-based) for a given card tag, or undefined if unmapped. */
  public getTrackIndexForTag(tag: Tag): number | undefined {
    return this.tagToTrack.get(tag);
  }

  /** Get a track by its 1-based number. */
  public getTrack(num: number): MarsBotTrack {
    return this.tracks[num - 1];
  }

  /** Check if a tag is mapped to any track. */
  public hasTrackForTag(tag: Tag): boolean {
    return this.tagToTrack.has(tag);
  }

  /** Get the index of the least-advanced track (lowest position, topmost/lowest index if tied). */
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

  /** Get the index of the most-advanced track (highest position, topmost/lowest index if tied). */
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

  /** Get the index of the most-advanced track that hasn't reached max position. */
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
