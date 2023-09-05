import {Reward} from './Reward';

export type PlanetaryTrack = {
  spaces: ReadonlyArray<PlanetaryTrackSpace>;
}

export type PlanetaryTrackSpace = {
  everyone: ReadonlyArray<Reward>;
  risingPlayer: ReadonlyArray<Reward>;
  mostTags: ReadonlyArray<Reward>;
}

export class TrackBuilder {
  private spaces: Array<PlanetaryTrackSpace>;
  private currentSpace: number;

  public constructor(size: number) {
    this.spaces = [];
    for (let idx = 0; idx <= size; idx++) {
      this.spaces.push({
        risingPlayer: [],
        everyone: [],
        mostTags: [],
      });
    }
    this.currentSpace = 0;
  }

  public at(space: number): this {
    this.currentSpace = space;
    return this;
  }

  public everyone(...rewards: Array<Reward>): this {
    this.spaces[this.currentSpace].everyone = rewards;
    return this;
  }

  public risingPlayer(...rewards: Array<Reward>): this {
    this.spaces[this.currentSpace].risingPlayer = rewards;
    return this;
  }

  public mostTags(...rewards: Array<Reward>): this {
    this.spaces[this.currentSpace].mostTags = rewards;
    return this;
  }

  public build(): PlanetaryTrack {
    return {
      spaces: this.spaces,
    };
  }
}
