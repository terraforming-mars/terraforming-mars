import {RequirementType} from '../../../common/cards/RequirementType';
import {ICardRequirement} from '../../../common/cards/ICardRequirement';
import {IPlayer} from '../../IPlayer';

export type LocalOptions = {
  max: boolean,
  all: boolean,
  text: string | undefined,
  nextTo: boolean,
  count: number,
};

export type Options = Partial<LocalOptions>;

export type YesAnd = {
  ok: true,
  thinkTankResources?: number
}

export abstract class CardRequirement implements ICardRequirement, LocalOptions {
  public abstract readonly type: RequirementType;
  public readonly count: number;
  public readonly max: boolean;
  public readonly all: boolean;
  /** Used during card rendering. */
  public readonly text: string | undefined;
  /** Used during card rendering. */
  public readonly nextTo: boolean;

  constructor(options?: Options) {
    this.count = options?.count ?? 1;
    this.max = options?.max ?? false;
    this.all = options?.all ?? false;
    this.nextTo = options?.nextTo ?? false;
    this.text = options?.text;
  }

  public abstract satisfies(player: IPlayer, thinkTankResources?: number) : boolean | YesAnd;
}
