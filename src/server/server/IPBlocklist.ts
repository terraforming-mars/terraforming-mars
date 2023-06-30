import {AddressInfo} from 'net';

export interface IPBlockList {
  isBlocked(id: string | AddressInfo): boolean;
  block(id: string | AddressInfo): void;
  unblock(id: string | AddressInfo): void;
  get(): Array<string>;
}

export function newIpBlocklist(ips: Array<string>): IPBlockList {
  console.log('Creating IP Blocklist with IPs ' + ips.join(', '));
  const blocklist = new BlockList();
  for (const ip of ips) {
    blocklist.block(ip);
  }
  return blocklist;
}

class BlockList implements IPBlockList {
  private ips: Set<string> = new Set();

  private toString(id: string | AddressInfo): string {
    if (typeof id === 'string') {
      return id;
    }
    return id.address;
  }
  public isBlocked(id: string | AddressInfo) {
    return this.ips.has(this.toString(id));
  }
  public block(id: string | AddressInfo) {
    this.ips.add(this.toString(id));
  }

  public unblock(id: string | AddressInfo) {
    this.ips.delete(this.toString(id));
  }

  public get(): Array<string> {
    return Array.from(this.ips);
  }
}
