import {GameId, ParticipantId, PlayerId, SpectatorId, isGameId, isPlayerId, isSpectatorId} from '@/common/Types';
import {RouteError} from './RouteError';

export class UrlParams {
  private urlSearchParmams: URLSearchParams;
  constructor(urlSearchParams: URLSearchParams) {
    this.urlSearchParmams = urlSearchParams;
  }

  private get(name: string): string {
    const value = this.urlSearchParmams.get(name);
    if (value === null) {
      throw RouteError.badRequest('missing ' + name + ' parameter');
    }
    return value;
  }
  public playerId(name: string): PlayerId {
    const id = this.get(name);
    if (!isPlayerId(id)) {
      throw RouteError.badRequest('invalid player id');
    }
    return id;
  }
  public gameId(name: string): GameId {
    const id = this.get(name);
    if (!isGameId(id)) {
      throw RouteError.badRequest('invalid game id');
    }
    return id;
  }
  public spectatorId(name: string): SpectatorId {
    const id = this.get(name);
    if (!isSpectatorId(id)) {
      throw RouteError.badRequest('invalid spectator id');
    }
    return id;
  }
  public participantId(name: string): ParticipantId {
    const id = this.get(name);
    if (!isPlayerId(id) && !isSpectatorId(id)) {
      throw RouteError.badRequest('invalid participant id');
    }
    return id;
  }
  public number(name: string): number {
    return Number(this.get(name));
  }
  numberOrUndefined(name: string): number | undefined {
    const value = this.urlSearchParmams.get(name);
    if (value === null) {
      return undefined;
    }
    return Number(value);
  }
  stringOrUndefined(name: string): string | undefined {
    return this.urlSearchParmams.get(name) ?? undefined;
  }
}
