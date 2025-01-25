const path = require('path');

import {Session, SessionId} from '../../auth/Session';
import {existsSync, readFileSync, writeFileSync} from 'fs';

export interface ISessionStore {
  read(): Promise<Map<SessionId, Session>>;
  write(sessions: Map<SessionId, Session>): Promise<void>;
}

export class SessionStore implements ISessionStore {
  private readonly filename = path.resolve(process.cwd(), './db/files/sessions.json');
  public read(): Promise<Map<SessionId, Session>> {
    const map = new Map<SessionId, Session>();
    if (existsSync(this.filename)) {
      try {
        const text = readFileSync(this.filename);
        const serialized = JSON.parse(text.toString());
        for (const k of Object.keys(serialized)) {
          const v = serialized[k];
          map.set(k, v);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return Promise.resolve(map);
  }

  public write(sessions: Map<SessionId, Session>): Promise<void> {
    const obj = Object.fromEntries([...sessions]);
    const text: string = JSON.stringify(obj, null, 2);
    writeFileSync(this.filename, text);
    return Promise.resolve();
  }
}
