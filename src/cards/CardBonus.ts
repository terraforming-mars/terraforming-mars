import { CardBonusType } from "../cards/CardBonusType";
import { Resources } from "../Resources";
import { Tags } from "./Tags";
import { TileType } from "../TileType";
import { ResourceType } from "../ResourceType";
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
    public static microbes(amount: number): CardBonusResourceAdditional {
        return new CardBonusResourceAdditional(amount, ResourceType.MICROBE);
    }
    public static animals(amount: number): CardBonusResourceAdditional {
        return new CardBonusResourceAdditional(amount, ResourceType.ANIMAL);
    }
    public static floaters(amount: number): CardBonusResourceAdditional {
        return new CardBonusResourceAdditional(amount, ResourceType.FLOATER);
    }
    public static cards(amount: number): CardBonusCard {
        return new CardBonusCard(amount);
    }
    public any(): CardBonus {
        this.anyPlayer = true;
        return this;
    }
}
export class CardBonusCard extends CardBonus {
    constructor(amount: number) {
        super(CardBonusType.CARD, amount);
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

interface ITagDependency {
    tagDependency?: Tags
}

interface ICardBonusWithResourceType extends CardBonus {
    resourceType: ResourceType | Resources | TileType | Tags;
    getResourceType(): ResourceType | Resources | TileType | Tags;
}

export class CardBonusResource extends CardBonus implements ICardBonusWithResourceType {
    constructor(
        amount: number,
        public resourceType: Resources,
        private amountInside: boolean = false,
    ) {
        super(CardBonusType.RESOURCE, amount);
        this.resourceType = resourceType;
    }
    public getResourceType(): Resources {
        return this.resourceType;
    }
    public inside(): CardBonusResource {
        this.amountInside = true;
        return this;
    }
    public getIsAmountInside(): boolean {
        return this.amountInside;
    }
}

export class CardBonusResourceAdditional extends CardBonus implements ICardBonusWithResourceType, ITagDependency {
    public tagDependency: Tags | undefined;

    constructor(amount: number, public resourceType: ResourceType) {
        super(CardBonusType.RESOURCE_ADDITIONAL, amount);
        this.resourceType = resourceType;
    }
    public getResourceType(): ResourceType {
        return this.resourceType;
    }
    public getTagDependency(): Tags | undefined {
        return this.tagDependency;
    }
    public depends(tagDependency: Tags): CardBonusResourceAdditional {
        this.tagDependency = tagDependency;
        return this;
    }
}

export class CardBonusTag extends CardBonus implements ICardBonusWithResourceType {
    constructor(amount: number, public resourceType: Tags) {
        super(CardBonusType.TAG, amount);
        this.resourceType = resourceType;
    }
    public getResourceType(): Tags {
        return this.resourceType;
    }
}

export class CardBonusTile extends CardBonus implements ICardBonusWithResourceType {
    constructor(amount: number, public resourceType: TileType) {
        super(CardBonusType.TILE, amount);
        this.resourceType = resourceType;
    }
    public getResourceType(): TileType {
        return this.resourceType;
    }
}