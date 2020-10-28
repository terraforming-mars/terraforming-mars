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
        protected anyPlayer: boolean = false,
        protected showDigit: boolean = false
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
    public getShowDigit(): boolean {
        return this.showDigit;
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
    public static trade(): CardBonusColonySpecial {
        return new CardBonusColonySpecial(1, RequirementType.TRADE);
    }
    public static tradeFleet(): CardBonusColonySpecial {
        return new CardBonusColonySpecial(1, RequirementType.TRADE_FLEET);
    }
    public static colony(amount: number): CardBonusColonySpecial {
        return new CardBonusColonySpecial(amount, RequirementType.COLONIES);
    }
    public static tradeDiscount(amount: number): CardBonusColonySpecial {
        return new CardBonusColonySpecial(amount * -1, RequirementType.TRADE_DISCOUNT);
    }
    public static event(amount: number): CardBonusTag {
        return new CardBonusTag(amount, Tags.EVENT);
    }
    public static influence(amount: number): CardBonusTurmoilSpecial {
        return new CardBonusTurmoilSpecial(amount, RequirementType.INFLUENCE);
    }
    public static leader(amount: number): CardBonusTurmoilSpecial {
        return new CardBonusTurmoilSpecial(amount, RequirementType.PARTY_LEADERS);
    }
    public static delegate(amount: number): CardBonusTurmoilSpecial {
        return new CardBonusTurmoilSpecial(amount, RequirementType.DELEGATES);
    }
    public static chairman(): CardBonusTurmoilSpecial {
        return new CardBonusTurmoilSpecial(1, RequirementType.CHAIRMAN);
    }
    public static asteroids(amount: number): CardBonusResourceAdditional {
        return new CardBonusResourceAdditional(amount, ResourceType.ASTEROID);
    }
    public any(): CardBonus {
        this.anyPlayer = true;
        return this;
    }
    public digit(): CardBonus {
        this.showDigit = true;
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
    tagDependency?: Tags;
}
interface ICardBonusPlayedItem {
    isPlayed?: boolean;
    getIsPlayed(): boolean | undefined;
}

interface ICardBonusWithResourceType extends CardBonus {
    resourceType: ResourceType | Resources | TileType | Tags | RequirementType;
    getResourceType(): ResourceType | Resources | TileType | Tags | RequirementType;
}

export class CardBonusResource
    extends CardBonus
    implements ICardBonusWithResourceType, ICardBonusPlayedItem {
    constructor(
        amount: number,
        public resourceType: Resources,
        private amountInside: boolean = false,
        public isPlayed: boolean = false
    ) {
        super(CardBonusType.RESOURCE, amount);
        this.resourceType = resourceType;
        this.isPlayed = isPlayed;
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
    public getIsPlayed(): boolean | undefined {
        return this.isPlayed;
    }
    public played(): CardBonus {
        this.isPlayed = true;
        return this;
    }
}

export class CardBonusResourceAdditional
    extends CardBonus
    implements ICardBonusWithResourceType, ITagDependency, ICardBonusPlayedItem {
    public tagDependency: Tags | undefined;

    constructor(
        amount: number,
        public resourceType: ResourceType,
        public isPlayed: boolean = false
    ) {
        super(CardBonusType.RESOURCE_ADDITIONAL, amount);
        this.resourceType = resourceType;
        this.isPlayed = isPlayed;
    }
    public getResourceType(): ResourceType {
        return this.resourceType;
    }
    public getTagDependency(): Tags | undefined {
        return this.tagDependency;
    }
    public getIsPlayed(): boolean | undefined {
        return this.isPlayed;
    }
    public depends(tagDependency: Tags): CardBonusResourceAdditional {
        this.tagDependency = tagDependency;
        return this;
    }
    public played(): CardBonus {
        this.isPlayed = true;
        return this;
    }
}

export class CardBonusTag
    extends CardBonus
    implements ICardBonusWithResourceType, ICardBonusPlayedItem {
    constructor(amount: number, public resourceType: Tags, public isPlayed: boolean = false) {
        super(CardBonusType.TAG, amount);
        this.resourceType = resourceType;
        this.isPlayed = isPlayed;
    }
    public getResourceType(): Tags {
        return this.resourceType;
    }
    public getIsPlayed(): boolean | undefined {
        return this.isPlayed;
    }
    public played(): CardBonus {
        this.isPlayed = true;
        return this;
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

export class CardBonusColonySpecial extends CardBonus implements ICardBonusWithResourceType {
    constructor(amount: number, public resourceType: RequirementType) {
        super(CardBonusType.GLOBAL, amount);
        this.resourceType = resourceType;
    }
    public getResourceType(): RequirementType {
        return this.resourceType;
    }
}

export class CardBonusTurmoilSpecial extends CardBonus implements ICardBonusWithResourceType {
    constructor(amount: number, public resourceType: RequirementType) {
        super(CardBonusType.TURMOIL_SPECIAL, amount);
        this.resourceType = resourceType;
    }
    public getResourceType(): RequirementType {
        return this.resourceType;
    }
}
