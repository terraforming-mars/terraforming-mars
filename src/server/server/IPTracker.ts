import {ParticipantId} from '../../common/Types';

export interface IPTracker {
  addParticipant(participantId: ParticipantId, ip: string): void;
  add(ip: string): void;
  toJSON(): any;
}

type Value = {
  count: number,
  participantIds: Set<ParticipantId>;
}

class IPTrackerImpl implements IPTracker {
  private map = new Map<string, Value>();

  private get(k: string): Value {
    const v = this.map.get(k);
    if (v !== undefined) {
      return v;
    }
    return {count: 0, participantIds: new Set()};
  }

  public add(ip: string): void {
    const value = this.get(ip);
    value.count++;
    this.map.set(ip, value);
  }

  public addParticipant(participantId: ParticipantId, ip: string): void {
    const value = this.get(ip);
    value.participantIds.add(participantId);
    this.map.set(ip, value);
  }

  public toJSON(): any {
    const json: any = {};
    this.map.forEach((v, k) => {
      json[k] = {
        count: v.count,
        ids: Array.from(v.participantIds),
      };
    });
    return json;
  }
}

export function newIpTracker(): IPTracker {
  return new IPTrackerImpl();
}
