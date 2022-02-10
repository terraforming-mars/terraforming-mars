import {AltSecondaryTag, CardRenderItem, ItemOptions} from './CardRenderItem';
import {CardRenderSymbol} from './CardRenderSymbol';
import {Size} from './Size';
import {CardRenderItemType} from './CardRenderItemType';
import {TileType} from '../../common/TileType';

export type ItemType = CardRenderItem | CardRenderProductionBox | CardRenderSymbol | CardRenderEffect | CardRenderTile | string | undefined;

export class CardRenderer {
  constructor(public rows: Array<Array<ItemType>> = [[]]) {}

  public static builder(f: (builder: Builder) => void): CardRenderer {
    const builder = new Builder();
    f(builder);
    return builder.build();
  }
}

export class CardRenderProductionBox extends CardRenderer {
  constructor(rows: Array<Array<ItemType>>) {
    super(rows);
  }

  public static override builder(f: (builder: ProductionBoxBuilder) => void): CardRenderProductionBox {
    const builder = new ProductionBoxBuilder();
    f(builder);
    return builder.build();
  }
}

export class CardRenderTile {
  constructor(public tile: TileType, public hasSymbol: boolean, public isAres: boolean) { }
}

export class CardRenderEffect extends CardRenderer {
  constructor(rows: Array<Array<ItemType>>) {
    super(rows);
  }

  public static override builder(f: (builder: EffectBuilder) => void): CardRenderEffect {
    const builder = new EffectBuilder();
    f(builder);
    return builder.build();
  }

  /**
   * Check if the card effect structure is valid
   */
  protected _validate(): void {
    if (this.rows.length !== 3) {
      throw new Error('Card effect must have 3 arrays representing cause, delimiter and effect. If there is no cause, start with `empty`.');
    }
    if (this.rows[1].length !== 1) {
      throw new Error('Card effect delimiter array must contain exactly 1 item');
    }
    if (!(this.rows[1][0] instanceof CardRenderSymbol)) {
      throw new Error('Effect delimiter must be a symbol');
    }
  }

  public get cause(): Array<ItemType> | undefined {
    this._validate();
    return this.rows[0];
  }

  public get delimiter(): ItemType {
    this._validate();
    if (this.cause?.length === 0) {
      return undefined;
    }
    return this.rows[1][0];
  }

  public get effect(): Array<ItemType> {
    this._validate();
    return this.rows[2];
  }

  public get description(): ItemType {
    this._validate();
    return this.rows[2].slice(-1)[0];
  }

  public set description(content: ItemType) {
    this.rows[2].push(content);
  }
}

export class CardRenderCorpBoxEffect extends CardRenderer {
  constructor(rows: Array<Array<ItemType>>) {
    super(rows);
  }

  public static override builder(f: (builder: CorpEffectBuilderEffect) => void): CardRenderCorpBoxEffect {
    const builder = new CorpEffectBuilderEffect();
    f(builder);
    return builder.build();
  }
}

export class CardRenderCorpBoxAction extends CardRenderer {
  constructor(rows: Array<Array<ItemType>>) {
    super(rows);
  }

  public static override builder(f: (builder: CorpEffectBuilderAction) => void): CardRenderCorpBoxAction {
    const builder = new CorpEffectBuilderAction();
    f(builder);
    return builder.build();
  }
}

class Builder {
  protected _data: Array<Array<ItemType>> = [[]];

  public build(): CardRenderer {
    return new CardRenderer(this._data);
  }

  protected _currentRow(): Array<ItemType> {
    if (this._data.length === 0) {
      throw new Error('No items in builder data!');
    }
    return this._data[this._data.length - 1];
  }

  protected _appendToRow(thing: ItemType | CardRenderSymbol | CardRenderTile) {
    this._currentRow().push(thing);
    return this;
  }

  public temperature(amount: number): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TEMPERATURE, amount));
  }

  public oceans(amount: number, options?: ItemOptions): Builder {
    // Is this necessary?
    const opts = options ?? {size: Size.MEDIUM};
    opts.size = opts.size ?? Size.MEDIUM;
    const item = new CardRenderItem(CardRenderItemType.OCEANS, amount, options);
    return this._appendToRow(item);
  }

  public oxygen(amount: number): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.OXYGEN, amount));
  }

  public venus(amount: number, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.VENUS, amount, options));
  }

  public plants(amount: number, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.PLANTS, amount, options));
  }

  public microbes(amount: number, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MICROBES, amount, options));
  }

  public animals(amount: number, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.ANIMALS, amount, options));
  }

  public heat(amount: number, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.HEAT, amount, options));
  }

  public energy(amount: number, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.ENERGY, amount, options));
  }

  public titanium(amount: number, options?: ItemOptions): Builder {
    const item = new CardRenderItem(CardRenderItemType.TITANIUM, amount, options);
    return this._appendToRow(item);
  }

  public steel(amount: number, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.STEEL, amount, options));
  }

  public tr(amount: number, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TR, amount, options));
  }

  public megacredits(amount: number, options?: ItemOptions): Builder {
    const item = new CardRenderItem(CardRenderItemType.MEGACREDITS, amount, options);
    item.amountInside = true;
    item.showDigit = false;
    item.size = options?.size ?? Size.MEDIUM;
    return this._appendToRow(item);
  }

  public cards(amount: number, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.CARDS, amount, options));
  }

  public floaters(amount: number, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.FLOATERS, amount, options));
  }

  public asteroids(amount: number, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.ASTEROIDS, amount, options));
  }

  public event(options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.EVENT, -1, options));
  }

  public space(options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.SPACE, -1, options));
  }

  public earth(amount: number = -1, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.EARTH, amount, options));
  }

  public building(amount: number = -1, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.BUILDING, amount, options));
  }

  public jovian(options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.JOVIAN, -1, options));
  }

  public science(amount: number = 1, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.SCIENCE, amount, options));
  }

  public trade(options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TRADE, -1, options));
  }
  public tradeFleet(): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TRADE_FLEET));
  }

  public colonies(amount: number = 1, options?: ItemOptions): Builder {
    const item = new CardRenderItem(CardRenderItemType.COLONIES, amount, options);
    item.size = options?.size ?? Size.MEDIUM;
    return this._appendToRow(item);
  }

  public tradeDiscount(amount: number): Builder {
    const item = new CardRenderItem(CardRenderItemType.TRADE_DISCOUNT, amount * -1);
    item.amountInside = true;
    return this._appendToRow(item);
  }

  public placeColony(options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.PLACE_COLONY, -1, options));
  }

  public influence(options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.INFLUENCE, 1, options));
  }

  public city(options?: ItemOptions) {
    const item = new CardRenderItem(CardRenderItemType.CITY, -1, options);
    item.size = options?.size ?? Size.MEDIUM;
    return this._appendToRow(item);
  }

  public greenery(size: Size = Size.MEDIUM, withO2: boolean = true) {
    const item = new CardRenderItem(CardRenderItemType.GREENERY);
    item.size = size;
    if (withO2) {
      item.secondaryTag = AltSecondaryTag.OXYGEN;
    }
    return this._appendToRow(item);
  }

  public delegates(amount: number, options?: ItemOptions) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.DELEGATES, amount, options));
  }

  public partyLeaders(amount: number = -1) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.PARTY_LEADERS, amount));
  }

  public chairman(options?: ItemOptions) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.CHAIRMAN, -1, options));
  }

  public globalEvent() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.GLOBAL_EVENT));
  }

  public noTags() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.NO_TAGS, -1));
  }

  public wild(amount: number, options?: ItemOptions) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.WILD, amount, options));
  }

  public preservation(amount: number) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.PRESERVATION, amount));
  }

  public diverseTag(amount: number = 1) {
    const item = new CardRenderItem(CardRenderItemType.DIVERSE_TAG, amount);
    item.isPlayed = true;
    return this._appendToRow(item);
  }

  public fighter(amount: number = 1) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.FIGHTER, amount));
  }

  public camps(amount: number = 1) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.CAMPS, amount));
  }

  public selfReplicatingRobots() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.SELF_REPLICATING));
  }

  public prelude() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.PRELUDE));
  }

  public award() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.AWARD));
  }

  public vpIcon() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.VP));
  }

  public community() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.COMMUNITY));
  }

  public disease() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.DISEASE));
  }

  public data(options?: ItemOptions | undefined) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.DATA_RESOURCE, 1, options));
  }

  public venusianHabitat(amount: number): Builder {
    this._appendToRow(new CardRenderItem(CardRenderItemType.VENUSIAN_HABITAT, amount));
    return this;
  }

  public specializedRobot(amount: number): Builder {
    this._appendToRow(new CardRenderItem(CardRenderItemType.SPECIALIZED_ROBOT, amount));
    return this;
  }

  public multiplierWhite() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MULTIPLIER_WHITE));
  }

  public description(description: string | undefined = undefined): Builder {
    return this._appendToRow(description);
  }

  public moon(amount: number = -1, options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON, amount, options));
  }

  public resourceCube(amount = 1): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.RESOURCE_CUBE, amount));
  }

  public moonColony(options?: ItemOptions | undefined): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_COLONY, 1, options));
  }

  public moonColonyRate(options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_COLONY_RATE, 1, options));
  }

  // TODO(kberg): Replace moon road image with JUST a road, and add an altsecondary tag to support it.
  public moonRoad(options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_ROAD, 1, options));
  }

  public moonLogisticsRate(options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_LOGISTICS_RATE, 1, options));
  }

  public moonMine(options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_MINE, 1, options));
  }

  public moonMiningRate(options?: ItemOptions): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_MINING_RATE, 1, options));
  }

  public syndicateFleet(amount: number = 1): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.SYNDICATE_FLEET, amount));
  }

  public mars(amount: number, options?: ItemOptions): Builder {
    this._appendToRow(new CardRenderItem(CardRenderItemType.MARS, amount, options));
    return this;
  }

  public planetaryTrack(): Builder {
    this._appendToRow(new CardRenderItem(CardRenderItemType.PLANETARY_TRACK, 1));
    return this;
  }

  public seed(): Builder {
    this._appendToRow(new CardRenderItem(CardRenderItemType.SEED, 1));
    return this;
  }

  public orbital(): Builder {
    this._appendToRow(new CardRenderItem(CardRenderItemType.ORBITAL, 1));
    return this;
  }

  public specialTile(options?: ItemOptions) {
    this._appendToRow(new CardRenderItem(CardRenderItemType.EMPTY_TILE_SPECIAL, 1, options));
    return this;
  }

  public emptyTile(type: 'normal' | 'golden' = 'normal', options?: ItemOptions) {
    if (type === 'normal') {
      const normal = new CardRenderItem(CardRenderItemType.EMPTY_TILE, -1, options);
      normal.size = options?.size ?? Size.MEDIUM;
      this._appendToRow(normal);
    } else if (type === 'golden') {
      const golden = new CardRenderItem(CardRenderItemType.EMPTY_TILE_GOLDEN, -1, options);
      golden.size = options?.size ?? Size.MEDIUM;
      this._appendToRow(golden);
    }
    return this;
  }

  public production(pb: (builder: ProductionBoxBuilder) => void): Builder {
    return this._appendToRow(CardRenderProductionBox.builder(pb));
  }

  public standardProject(description: string, eb: (builder: EffectBuilder) => void): Builder {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description;
    return this._appendToRow(builder);
  }

  public action(description: string | undefined, eb: (builder: EffectBuilder) => void): Builder {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description !== undefined ? 'Action: ' + description : undefined;
    return this._appendToRow(builder);
  }

  public effect(description: string | undefined, eb: (builder: EffectBuilder) => void): Builder {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description !== undefined ? 'Effect: ' + description : undefined;
    return this._appendToRow(builder);
  }

  public corpBox(type: 'action' | 'effect', eb: (builder: CorpEffectBuilderEffect | CorpEffectBuilderAction) => void): Builder {
    this.br;
    if (type === 'action') {
      return this._appendToRow(CardRenderCorpBoxAction.builder(eb));
    } else {
      return this._appendToRow(CardRenderCorpBoxEffect.builder(eb));
    }
  }

  public or(size: Size = Size.SMALL): Builder {
    return this._appendToRow(CardRenderSymbol.or(size));
  }

  public asterix(size: Size = Size.MEDIUM): Builder {
    return this._appendToRow(CardRenderSymbol.asterix(size));
  }

  public plus(size: Size = Size.MEDIUM): Builder {
    return this._appendToRow(CardRenderSymbol.plus(size));
  }

  public minus(size: Size = Size.MEDIUM): Builder {
    return this._appendToRow(CardRenderSymbol.minus(size));
  }

  public slash(size: Size = Size.MEDIUM): Builder {
    return this._appendToRow(CardRenderSymbol.slash(size));
  }

  public colon(size: Size = Size.MEDIUM): Builder {
    return this._appendToRow(CardRenderSymbol.colon(size));
  }

  public arrow(size: Size = Size.MEDIUM): Builder {
    return this._appendToRow(CardRenderSymbol.arrow(size));
  }

  public equals(size: Size = Size.MEDIUM): Builder {
    return this._appendToRow(CardRenderSymbol.equals(size));
  }

  public empty(): Builder {
    return this._appendToRow(CardRenderSymbol.empty());
  }

  public plate(text: string): Builder {
    const item = new CardRenderItem(CardRenderItemType.PLATE);
    item.text = text;
    item.isPlate = true;
    item.isBold = true;
    return this._appendToRow(item);
  }

  public text(text: string, size: Size = Size.MEDIUM, uppercase: boolean = false, isBold: boolean = true): Builder {
    const item = new CardRenderItem(CardRenderItemType.TEXT);
    item.text = text;
    item.size = size;
    item.isUppercase = uppercase;
    item.isBold = isBold;
    return this._appendToRow(item);
  }

  public vpText(text: string): Builder {
    return this.text(text, Size.TINY, true);
  }

  public get br(): Builder {
    this._data.push([]);
    return this;
  }

  public tile(tile: TileType, hasSymbol: boolean = false, isAres: boolean = false): Builder {
    return this._appendToRow(new CardRenderTile(tile, hasSymbol, isAres));
  }

  /*
   * A one off function to handle Project Requirements prelude card
   */
  public projectRequirements(): Builder {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.PROJECT_REQUIREMENTS));
  }

  /**
   * add non breakable space or simply empty space between items
   */
  public get nbsp(): Builder {
    return this._appendToRow(CardRenderSymbol.nbsp());
  }

  /*
   * add non breakable vertical space (a div with different pixels height)
   */
  public vSpace(size: Size = Size.MEDIUM): Builder {
    return this._appendToRow(CardRenderSymbol.vSpace(size));
  }

  public get openBrackets(): Builder {
    return this._appendToRow(CardRenderSymbol.bracketOpen());
  }

  public get closeBrackets(): Builder {
    return this._appendToRow(CardRenderSymbol.bracketClose());
  }

  /**
   * Used to start the effect for action(), effect() and standardProject(), also adds a delimiter symbol
   */
  public get startEffect(): Builder {
    this.br;
    this._appendToRow(CardRenderSymbol.colon());
    this.br;
    return this;
  }

  public get startAction(): Builder {
    this.br;
    this._appendToRow(CardRenderSymbol.arrow());
    this.br;
    return this;
  }
}

class ProductionBoxBuilder extends Builder {
  public override build(): CardRenderProductionBox {
    return new CardRenderProductionBox(this._data);
  }
}

class EffectBuilder extends Builder {
  public override build(): CardRenderEffect {
    return new CardRenderEffect(this._data);
  }
}

class CorpEffectBuilderEffect extends Builder {
  public override build(): CardRenderCorpBoxAction {
    return new CardRenderCorpBoxEffect(this._data);
  }
}

class CorpEffectBuilderAction extends Builder {
  public override build(): CardRenderCorpBoxEffect {
    return new CardRenderCorpBoxAction(this._data);
  }
}
