import {IProjectCard} from '../cards/IProjectCard';
import {IGame} from '../IGame';
import {Space} from '../boards/Space';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';

type Party = 'mf' | 's' | 'u' | 'k' | 'r' | 'g';
type Suffix = 'p01' | 'p02' | 'p03' | 'p04';
export type PolicyId = `${Party}${Suffix}`

// TODO(kberg): Rename to IPolicy
export interface Policy {
  id: PolicyId;
  description: string | ((player: IPlayer | undefined) => string);
  onTilePlaced?(player: IPlayer, space: Space): void;
  onCardPlayed?(player: IPlayer, card: IProjectCard): void;
  action?(player: IPlayer): PlayerInput | undefined;
  canAct?(player: IPlayer): boolean;
  onPolicyStart?(game: IGame): void;
  onPolicyStartForPlayer?(player: IPlayer): void;
  onPolicyEnd?(game: IGame): void;
  onPolicyEndForPlayer?(player: IPlayer): void;
  }

// TODO(kberg): Rename to Policy
export abstract class BasePolicy implements Policy {
  abstract readonly id: PolicyId;
  abstract readonly description: string | ((player: IPlayer | undefined) => string);

  public onPolicyStart(game: IGame): void {
    game.getPlayersInGenerationOrder().forEach((p) => this.onPolicyStartForPlayer(p));
  }

  public abstract onPolicyStartForPlayer(_player: IPlayer): void;

  public onPolicyEnd(game: IGame): void {
    game.getPlayersInGenerationOrder().forEach((p) => this.onPolicyEndForPlayer(p));
  }

  public abstract onPolicyEndForPlayer(_player: IPlayer): void;
}

export function policyDescription(policy: Policy, player: IPlayer | undefined): string {
  return typeof(policy.description) === 'string' ? policy.description : policy.description(player);
}
