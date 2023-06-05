import {RequirementType} from '../../../common/cards/RequirementType';
import {ICardRequirement} from '../../../common/cards/ICardRequirement';
import {Player} from '../../Player';

export type Options = {max?: boolean, all?: boolean, text?: string};

export type YesAnd = {
  ok: true,
  thinkTankResources?: number
}

export abstract class CardRequirement implements ICardRequirement {
  public abstract readonly type: RequirementType;
  public readonly amount: number;
  public readonly isMax: boolean = false;
  public readonly isAny: boolean = false;
  /** Used during card rendering. */
  public readonly text: string | undefined = undefined;

  constructor(amount: number = 1, options?: Options) {
    this.amount = amount;
    this.isMax = options?.max ?? false;
    this.isAny = options?.all ?? false;
    this.text = options?.text;
  }

  public abstract satisfies(player: Player, thinkTankResources?: number) : boolean | YesAnd;
}
