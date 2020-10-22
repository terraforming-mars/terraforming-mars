import { CardBonusType } from "../cards/CardBonusType";
import { Resources } from "../Resources";
import { RequirementType } from "./RequirementType";

export class CardBonus {
    protected constructor(
        private type: CardBonusType,
        protected amount: number = 1,
        protected anyPlayer: boolean = false
    ) {}
    public getAmount(): number {
        return this.amount;
    }
    public getType(): CardBonusType {
        return this.type;
    }
    public getAnyPlayer(): boolean {
        return this.anyPlayer;
    }
    public static oceans(amount: number): CardBonus {
        return new CardBonusGlobal(amount, RequirementType.OCEANS);
    }
    public static temperature(amount: number): CardBonus {
        return new CardBonusGlobal(amount, RequirementType.TEMPERATURE);
    }
    public static oxygen(amount: number): CardBonus {
        return new CardBonusGlobal(amount, RequirementType.OXYGEN);
    }
    public static venus(amount: number): CardBonus {
        return new CardBonusGlobal(amount, RequirementType.VENUS);
    }
    public static tr(amount: number): CardBonus {
        return new CardBonusGlobal(amount, RequirementType.TR);
    }
    public static forests(amount: number): CardBonus {
        return new CardBonusGlobal(amount, RequirementType.FORESTS);
    }
    public static titanium(amount: number): CardBonusResource {
        return new CardBonusResource(amount, Resources.TITANIUM);
    }
    public static steel(amount: number): CardBonusResource {
        return new CardBonusResource(amount, Resources.STEEL);
    }
    public static plants(amount: number): CardBonusResource {
        return new CardBonusResource(amount, Resources.PLANTS);
    }
    public static energy(amount: number): CardBonusResource {
        return new CardBonusResource(amount, Resources.ENERGY);
    }
    public static heat(amount: number): CardBonusResource {
        return new CardBonusResource(amount, Resources.HEAT);
    }
    public static megacredits(amount: number): CardBonusResource {
        return new CardBonusResource(amount, Resources.MEGACREDITS, true);
    }
    public any(): CardBonus {
        this.anyPlayer = true;
        return this;
    }
}

export class CardBonusResource extends CardBonus {
    constructor(
        amount: number,
        private resource: Resources,
        private amountInside: boolean = false
    ) {
        super(CardBonusType.RESOURCE, amount);
        this.resource = resource;
    }
    public getResourceType(): Resources {
        return this.resource;
    }
    public inside(): CardBonusResource {
        this.amountInside = true;
        return this;
    }
    public getIsAmountInside(): boolean {
        return this.amountInside;
    }
}

export class CardBonusGlobal extends CardBonus {
    constructor(amount: number, private globalRequirement: RequirementType) {
        super(CardBonusType.GLOBAL, amount);
        this.globalRequirement = globalRequirement;
    }
    public getGlobalRequirementType() {
        return this.globalRequirement;
    }
}
