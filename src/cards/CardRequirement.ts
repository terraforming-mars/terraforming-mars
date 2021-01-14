import {RequirementType} from './RequirementType';
import {Tags} from './Tags';
import {PartyName} from '../turmoil/parties/PartyName';
import {Resources} from '../Resources';

const firstLetterUpperCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export class CardRequirement {
  constructor(private _type: RequirementType, protected _amount: number, private _isMax: boolean = false, private _isAny: boolean = false) {}

  private amountToString(): string {
    if (this._type === RequirementType.OXYGEN || this._type === RequirementType.VENUS) {
      return `${this._amount}%`;
    } else if (this._type === RequirementType.TEMPERATURE) {
      return `${this._amount}°`;
    } else {
      return this._amount !== -1 ? this._amount.toString() : '';
    }
  }

  protected parseType(): string {
    const withPlural: Array<string> = [RequirementType.OCEANS, RequirementType.FLOATERS, RequirementType.GREENERIES, RequirementType.CITIES, RequirementType.COLONIES, RequirementType.RESOURCE_TYPES, RequirementType.PARTY_LEADERS];

    if (this._amount > 1 && withPlural.includes(this._type)) {
      return this.getTypePlural();
    }

    return this._type;
  }

  // TODO (chosta): add to a top level class - preferrably translatable
  public getTypePlural(): string {
    if (this._type === RequirementType.CITIES) {
      return 'Cities';
    } else if (this._type === RequirementType.COLONIES) {
      return 'Colonies';
    } else if (this._type === RequirementType.GREENERIES) {
      return 'Greeneries';
    } else {
      return `${this._type}s`;
    }
  }

  public getLabel(): string {
    let result: string = this._isMax ? 'max ' : '';
    const amount = this.amountToString();
    if (amount !== '') {
      result += amount;
      result += ' ';
    }
    result += this.parseType();

    return result;
  }

  public max(): CardRequirement {
    this._isMax = true;
    return this;
  }

  public any(): CardRequirement {
    this._isAny = true;
    return this;
  }

  public get isMax(): boolean {
    return this._isMax;
  }
  public get isAny(): boolean {
    return this._isAny;
  }
  public get type(): RequirementType {
    return this._type;
  }
  public get amount(): number {
    return this._amount;
  }
}

export class TagCardRequirement extends CardRequirement {
  constructor(private tag: Tags, amount: number) {
    super(RequirementType.TAG, amount);
  }

  protected parseType(): string {
    return firstLetterUpperCase(this.tag);
  }
}

export class ProductionCardRequirement extends CardRequirement {
  constructor(private resource: Resources, amount: number) {
    super(RequirementType.RESOURCE_TYPES, amount);
  }

  protected parseType(): string {
    return `${firstLetterUpperCase(this.resource)} production`;
  }
}

export class PartyCardRequirement extends CardRequirement {
  constructor(private party: PartyName) {
    super(RequirementType.PARTY, -1);
  }
  protected parseType(): string {
    return this.party.toLowerCase();
  }
}
