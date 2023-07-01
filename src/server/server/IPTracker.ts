import {ParticipantId} from '../../common/Types';
import {AddressInfo} from 'net';

type Key = AddressInfo | string;

export interface IPTracker {
  addParticipant(participantId: ParticipantId, ip: Key): void;
  add(ip: Key): void;
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

  private normalize(k: Key): string {
    if (typeof k === 'string') {
      return k;
    }
    return `address: ${k.address}, family: ${k.family}, port: ${k.port}`;
  }

  public add(ip: Key): void {
    ip = this.normalize(ip);
    const value = this.get(ip);
    value.count++;
    this.map.set(ip, value);
  }

  public addParticipant(participantId: ParticipantId, ip: Key): void {
    ip = this.normalize(ip);
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
