import {RequirementType} from '../../../common/cards/RequirementType';
import {ICardRequirement} from '../../../common/cards/ICardRequirement';
import {IPlayer} from '../../IPlayer';

export type LocalOptions = {
  max: boolean,
  all: boolean,
  text: string | undefined,
  nextTo: boolean
};

export type Options = Partial<LocalOptions>;

export type YesAnd = {
  ok: true,
  thinkTankResources?: number
}

export abstract class CardRequirement implements ICardRequirement, LocalOptions {
  public abstract readonly type: RequirementType;
  public readonly amount: number;
  public readonly max: boolean = false;
  public readonly all: boolean = false;
  /** Used during card rendering. */
  public readonly text: string | undefined = undefined;
  /** Used during card rendering. */
  public readonly nextTo: boolean = false;

  constructor(amount: number = 1, options?: Options) {
    this.amount = amount;
    this.max = options?.max ?? false;
    this.all = options?.all ?? false;
    this.nextTo = options?.nextTo ?? false;
    this.text = options?.text;
  }

  public abstract satisfies(player: IPlayer, thinkTankResources?: number) : boolean | YesAnd;
}
