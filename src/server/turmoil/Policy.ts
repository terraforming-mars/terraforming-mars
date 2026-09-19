import {IProjectCard} from '../cards/IProjectCard';
import {IGame} from '../IGame';
import {Space} from '../boards/Space';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {PolicyId} from '../../common/turmoil/Types';
import {CardComponent} from '@/common/cards/render/CardComponent';

// Represents a Turmoil policy.
export interface IPolicy {
  id: PolicyId;
  description: string | ((player: IPlayer | undefined) => string);
  renderData: CardComponent;
  onTilePlaced?(player: IPlayer, space: Space): void;
  onCardPlayed?(player: IPlayer, card: IProjectCard): void;
  action?(player: IPlayer): PlayerInput | undefined;
  canAct?(player: IPlayer): boolean;
  onPolicyStart?(game: IGame): void;
  onPolicyStartForPlayer?(player: IPlayer): void;
  onPolicyEnd?(game: IGame): void;
  onPolicyEndForPlayer?(player: IPlayer): void;
}

export abstract class Policy implements IPolicy {
  public readonly id: PolicyId;
  public readonly description: string | ((player: IPlayer | undefined) => string);
  public readonly renderData: CardComponent;

  constructor(id: PolicyId, description: string | ((player: IPlayer | undefined) => string), renderData: CardComponent) {
    this.id = id;
    this.description = description;
    this.renderData = renderData;
  }

  public onPolicyStart(game: IGame): void {
    game.playersInGenerationOrder.forEach((p) => this.onPolicyStartForPlayer?.(p));
  }

  public onPolicyStartForPlayer?(_player: IPlayer): void;

  public onPolicyEnd(game: IGame): void {
    game.playersInGenerationOrder.forEach((p) => this.onPolicyEndForPlayer?.(p));
  }

  public onPolicyEndForPlayer?(_player: IPlayer): void;
}

export function policyDescription(policy: IPolicy, player: IPlayer | undefined): string {
  return typeof(policy.description) === 'string' ? policy.description : policy.description(player);
}
