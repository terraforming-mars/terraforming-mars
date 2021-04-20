import {AltSecondaryTag, CardRenderItem, ItemOptions} from './CardRenderItem';
import {CardRenderSymbol} from './CardRenderSymbol';
import {Size} from './Size';
import {CardRenderItemType} from './CardRenderItemType';
import {TileType} from '../../TileType';
import {Tags} from '../Tags';

type ItemType = CardRenderItem | CardRenderProductionBox | CardRenderSymbol | CardRenderEffect | CardRenderTile | string | undefined;

export class CardRenderer {
  constructor(protected _rows: Array<Array<ItemType>> = [[]]) {}

  public get rows() {
    return this._rows;
  }

  public static builder(f: (builder: Builder) => void): CardRenderer {
    const builder = new Builder();
    f(builder);
    return builder.build();
  }
}

export class CardRenderProductionBox extends CardRenderer {
  constructor(rows: Array<Array<CardRenderItem | CardRenderSymbol>>) {
    super(rows);
  }

  public static builder(f: (builder: ProductionBoxBuilder) => void): CardRenderProductionBox {
    const builder = new ProductionBoxBuilder();
    f(builder);
    return builder.build();
  }
}

export class CardRenderTile {
  constructor(public tile: TileType, public hasSymbol: boolean, public isAres: boolean) { };
}

export class CardRenderEffect extends CardRenderer {
  constructor(rows: Array<Array<CardRenderItem | CardRenderSymbol | CardRenderProductionBox | CardRenderTile | string>>) {
    super(rows);
  }

  public static builder(f: (builder: EffectBuilder) => void): CardRenderEffect {
    const builder = new EffectBuilder();
    f(builder);
    return builder.build();
  }

  /**
   * Check if the card effect structure is valid
   */
  protected _validate(): void {
    if (this.rows.length !== 3) {
      throw new Error('Card effect must have 3 arrays representing cause, delimiter and effect');
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
  constructor(rows: Array<Array<CardRenderEffect | CardRenderItem | string>>) {
    super(rows);
  }

  public static builder(f: (builder: CorpEffectBuilderEffect) => void): CardRenderCorpBoxEffect {
    const builder = new CorpEffectBuilderEffect();
    f(builder);
    return builder.build();
  }
}

export class CardRenderCorpBoxAction extends CardRenderer {
  constructor(rows: Array<Array<CardRenderEffect | CardRenderItem | string>>) {
    super(rows);
  }

  public static builder(f: (builder: CorpEffectBuilderAction) => void): CardRenderCorpBoxAction {
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

  protected _getCurrentRow(): Array<ItemType> | undefined {
    return this._data.pop();
  }

  protected _addRowItem(item: ItemType): void {
    const currentRow = this._getCurrentRow();
    if (currentRow !== undefined) {
      currentRow.push(item);
      this._data.push(currentRow);
    }
  }

  protected _checkExistingItem(): void {
    if (this._data.length === 0) {
      throw new Error('No items in builder data!');
    }
  }

  protected _addSymbol(symbol: CardRenderSymbol): void {
    const row = this._getCurrentRow();
    if (row !== undefined) {
      row.push(symbol);
      this._data.push(row);
    }
  }

  protected _addTile(tile: TileType, hasSymbol: boolean, isAres: boolean): void {
    const row = this._getCurrentRow();
    if (row !== undefined) {
      row.push(new CardRenderTile(tile, hasSymbol, isAres));
      this._data.push(row);
    }
  }

  public temperature(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.TEMPERATURE, amount));
    return this;
  }

  public oceans(amount: number, size: Size = Size.MEDIUM): Builder {
    const item = new CardRenderItem(CardRenderItemType.OCEANS, amount);
    item.size = size;
    this._addRowItem(item);
    return this;
  }

  public oxygen(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.OXYGEN, amount));
    return this;
  }

  public venus(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.VENUS, amount));
    return this;
  }

  public plants(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.PLANTS, amount));
    return this;
  }

  public microbes(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.MICROBES, amount));
    return this;
  }

  public animals(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.ANIMALS, amount));
    return this;
  }

  public heat(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.HEAT, amount));
    return this;
  }

  public energy(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.ENERGY, amount));
    return this;
  }

  public titanium(amount: number, bigAmountShowDigit: boolean = true): Builder {
    const item = new CardRenderItem(CardRenderItemType.TITANIUM, amount);
    // override default showing a digit for items with amount > 5
    // Done as an exception for 'Acquired Space Agency'
    if (amount > 5 && bigAmountShowDigit === false) {
      item.showDigit = false;
    }
    this._addRowItem(item);
    return this;
  }

  public steel(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.STEEL, amount));
    return this;
  }

  public tr(amount: number, size: Size = Size.MEDIUM, cancelled: boolean = false): Builder {
    const item = new CardRenderItem(CardRenderItemType.TR, amount);
    item.size = size;
    item.cancelled = cancelled;
    this._addRowItem(item);
    return this;
  }

  public megacredits(amount: number, size: Size = Size.MEDIUM): Builder {
    const item = new CardRenderItem(CardRenderItemType.MEGACREDITS, amount);
    item.amountInside = true;
    item.showDigit = false;
    item.size = size;
    this._addRowItem(item);
    return this;
  }

  public cards(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.CARDS, amount));
    return this;
  }

  public floaters(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.FLOATERS, amount));
    return this;
  }

  public asteroids(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.ASTEROIDS, amount));
    return this;
  }

  public event(): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.EVENT));
    return this;
  }

  public space(): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.SPACE));
    return this;
  }

  public earth(amount: number = -1): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.EARTH, amount));
    return this;
  }

  public building(amount: number = -1): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.BUILDING, amount));
    return this;
  }

  public jovian(): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.JOVIAN));
    return this;
  }

  public science(amount: number = 1): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.SCIENCE, amount));
    return this;
  }

  public trade(): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.TRADE));
    return this;
  }
  public tradeFleet(): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.TRADE_FLEET));
    return this;
  }

  public colonies(amount: number = 1, size: Size = Size.MEDIUM): Builder {
    const item = new CardRenderItem(CardRenderItemType.COLONIES, amount);
    item.size = size;
    this._addRowItem(item);
    return this;
  }

  public tradeDiscount(amount: number): Builder {
    const item = new CardRenderItem(CardRenderItemType.TRADE_DISCOUNT, amount * -1);
    item.amountInside = true;
    this._addRowItem(item);
    return this;
  }

  public placeColony(): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.PLACE_COLONY));
    return this;
  }

  public influence(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.INFLUENCE, amount));
    return this;
  }

  public city(size: Size = Size.MEDIUM) {
    const item = new CardRenderItem(CardRenderItemType.CITY);
    item.size = size;
    this._addRowItem(item);
    return this;
  }

  public greenery(size: Size = Size.MEDIUM, withO2: boolean = true) {
    const item = new CardRenderItem(CardRenderItemType.GREENERY);
    item.size = size;
    if (withO2) {
      item.secondaryTag = AltSecondaryTag.OXYGEN;
    }
    this._addRowItem(item);
    return this;
  }

  public delegates(amount: number) {
    this._addRowItem(new CardRenderItem(CardRenderItemType.DELEGATES, amount));
    return this;
  }

  public partyLeaders(amount: number = -1) {
    this._addRowItem(new CardRenderItem(CardRenderItemType.PARTY_LEADERS, amount));
    return this;
  }

  public chairman() {
    this._addRowItem(new CardRenderItem(CardRenderItemType.CHAIRMAN));
    return this;
  }

  public noTags() {
    this._addRowItem(new CardRenderItem(CardRenderItemType.NO_TAGS, -1));
    return this;
  }

  public wild(amount: number) {
    this._addRowItem(new CardRenderItem(CardRenderItemType.WILD, amount));
    return this;
  }

  public preservation(amount: number) {
    this._addRowItem(new CardRenderItem(CardRenderItemType.PRESERVATION, amount));
    return this;
  }

  public diverseTag(amount: number = 1) {
    const item = new CardRenderItem(CardRenderItemType.DIVERSE_TAG, amount);
    item.isPlayed = true;
    this._addRowItem(item);
    return this;
  }

  public fighter(amount: number = 1) {
    this._addRowItem(new CardRenderItem(CardRenderItemType.FIGHTER, amount));
    return this;
  }

  public camps(amount: number = 1) {
    this._addRowItem(new CardRenderItem(CardRenderItemType.CAMPS, amount));
    return this;
  }

  public selfReplicatingRobots() {
    this._addRowItem(new CardRenderItem(CardRenderItemType.SELF_REPLICATING));
    return this;
  }

  public prelude() {
    this._addRowItem(new CardRenderItem(CardRenderItemType.PRELUDE));
    return this;
  }

  public award() {
    this._addRowItem(new CardRenderItem(CardRenderItemType.AWARD));
    return this;
  }

  public vpIcon() {
    this._addRowItem(new CardRenderItem(CardRenderItemType.VP));
    return this;
  }

  public community() {
    this._addRowItem(new CardRenderItem(CardRenderItemType.COMMUNITY));
    return this;
  }

  public disease() {
    this._addRowItem(new CardRenderItem(CardRenderItemType.DISEASE));
    return this;
  }

  public data(amount: number = 1) {
    this._addRowItem(new CardRenderItem(CardRenderItemType.DATA_RESOURCE, amount));
    return this;
  }

  public multiplierWhite() {
    this._addRowItem(new CardRenderItem(CardRenderItemType.MULTIPLIER_WHITE));
    return this;
  }

  public description(description: string | undefined = undefined): Builder {
    this._checkExistingItem();
    this._addRowItem(description);
    return this;
  }

  public moon(amount: number = -1): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.MOON, amount));
    return this;
  }

  public resourceCube(amount = 1): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.RESOURCE_CUBE, amount));
    return this;
  }

  public moonColony(options?: ItemOptions | undefined): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.MOON_COLONY).withOptions(options));
    return this;
  }

  public moonColonyRate(options?: ItemOptions): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.MOON_COLONY_RATE).withOptions(options));
    return this;
  }

  // TODO(kberg): Replace moon road image with JUST a road, and add an altsecondary tag to support it.
  public moonRoad(options?: ItemOptions): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.MOON_ROAD).withOptions(options));
    return this;
  }

  public moonLogisticsRate(options?: ItemOptions): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.MOON_LOGISTICS_RATE).withOptions(options));
    return this;
  }

  public moonMine(options?: ItemOptions): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.MOON_MINE).withOptions(options));
    return this;
  }

  public moonMiningRate(options?: ItemOptions): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.MOON_MINING_RATE).withOptions(options));
    return this;
  }

  public syndicateFleet(amount: number = 1): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.SYNDICATE_FLEET, amount));
    return this;
  }

  public emptyTile(type: 'normal' | 'golden' = 'normal', size: Size = Size.MEDIUM) {
    if (type === 'normal') {
      const normal = new CardRenderItem(CardRenderItemType.EMPTY_TILE, -1);
      normal.size = size;
      this._addRowItem(normal);
    } else if (type === 'golden') {
      const golden = new CardRenderItem(CardRenderItemType.EMPTY_TILE_GOLDEN, -1);
      golden.size = size;
      this._addRowItem(golden);
    }
    return this;
  }

  public production(pb: (builder: ProductionBoxBuilder) => void): Builder {
    this._addRowItem(CardRenderProductionBox.builder(pb));
    return this;
  }

  public standardProject(description: string, eb: (builder: EffectBuilder) => void): Builder {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description;
    this._addRowItem(builder);
    return this;
  }

  public action(description: string | undefined, eb: (builder: EffectBuilder) => void): Builder {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description !== undefined ? 'Action: ' + description : undefined;
    this._addRowItem(builder);
    return this;
  }

  public effect(description: string | undefined, eb: (builder: EffectBuilder) => void): Builder {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description !== undefined ? 'Effect: ' + description : undefined;
    this._addRowItem(builder);
    return this;
  }

  public corpBox(type: 'action' | 'effect', eb: (builder: CorpEffectBuilderEffect | CorpEffectBuilderAction) => void): Builder {
    this.br;
    if (type === 'action') {
      this._addRowItem(CardRenderCorpBoxAction.builder(eb));
    } else {
      this._addRowItem(CardRenderCorpBoxEffect.builder(eb));
    }
    return this;
  }

  public or(size: Size = Size.SMALL): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.or(size));
    return this;
  }

  public asterix(size: Size = Size.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.asterix(size));
    return this;
  }

  public plus(size: Size = Size.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.plus(size));
    return this;
  }

  public minus(size: Size = Size.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.minus(size));
    return this;
  }

  public slash(size: Size = Size.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.slash(size));
    return this;
  }

  public colon(size: Size = Size.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.colon(size));
    return this;
  }

  public arrow(size: Size = Size.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.arrow(size));
    return this;
  }

  public equals(size: Size = Size.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.equals(size));
    return this;
  }

  public empty(): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.empty());
    return this;
  }

  public plate(text: string): Builder {
    const item = new CardRenderItem(CardRenderItemType.PLATE);
    item.text = text;
    item.isPlate = true;
    item.isBold = true;
    this._addRowItem(item);
    return this;
  }

  public text(text: string, size: Size = Size.MEDIUM, uppercase: boolean = false, isBold: boolean = true): Builder {
    const item = new CardRenderItem(CardRenderItemType.TEXT);
    item.text = text;
    item.size = size;
    item.isUppercase = uppercase;
    item.isBold = isBold;
    this._addRowItem(item);
    return this;
  }

  public vpText(text: string): Builder {
    return this.text(text, Size.TINY, true);
  }

  public get br(): Builder {
    const newRow: Array<ItemType> = [];
    this._data.push(newRow);
    return this;
  }

  public tile(tile: TileType, hasSymbol: boolean = false, isAres: boolean = false): Builder {
    this._addTile(tile, hasSymbol, isAres);
    return this;
  }

  /*
   * A one off function to handle Project Requirements prelude card
   */
  public projectRequirements(): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.PROJECT_REQUIREMENTS));
    return this;
  }

  /**
   * add non breakable space or simply empty space between items
   */
  public get nbsp(): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.nbsp());
    return this;
  }

  /*
   * add non breakable vertical space (a div with different pixels height)
   */
  public vSpace(size: Size = Size.MEDIUM): Builder {
    this._addSymbol(CardRenderSymbol.vSpace(size));
    return this;
  }

  public get any(): Builder {
    this._checkExistingItem();

    const row = this._getCurrentRow();
    if (row !== undefined) {
      const item = row.pop();
      if (item === undefined) {
        throw new Error('Called "any" without a CardRenderItem.');
      }
      if (!(item instanceof CardRenderItem)) {
        throw new Error('"any" could be called on CardRenderItem only');
      }

      item.anyPlayer = true;
      row.push(item);
      this._data.push(row);
    }

    return this;
  }

  /**
   * Mark the last item in the queue as 'isPlayed'
   * e.g. titanium().played will result in a resource circle instead of square
   */
  public get played(): Builder {
    this._checkExistingItem();

    const row = this._getCurrentRow();
    if (row !== undefined) {
      const item = row.pop();
      if (item === undefined) {
        throw new Error('Called "played" without a CardRenderItem.');
      }
      if (!(item instanceof CardRenderItem)) {
        throw new Error('"played" could be called on CardRenderItem only');
      }

      item.isPlayed = true;
      row.push(item);
      this._data.push(row);
    }

    return this;
  }

  public get digit(): Builder {
    this._checkExistingItem();

    const row = this._getCurrentRow();
    if (row !== undefined) {
      const item = row.pop();
      if (item === undefined) {
        throw new Error('Called "digit" without a CardRenderItem.');
      }
      if (!(item instanceof CardRenderItem)) {
        throw new Error('"digit" could be called on CardRenderItem only');
      }

      item.showDigit = true;
      row.push(item);

      this._data.push(row);
    }

    return this;
  }

  /**
   * Mark any amount to be a multiplier 'X'
   */
  public get multiplier(): Builder {
    this._checkExistingItem();

    const row = this._getCurrentRow();
    if (row !== undefined) {
      const item = row.pop();
      if (item === undefined) {
        throw new Error('Called "multiplier" without a CardRenderItem.');
      }
      if (!(item instanceof CardRenderItem)) {
        throw new Error('"multiplier" could be called on CardRenderItem only');
      }

      item.amountInside = true;
      item.multiplier = true;
      row.push(item);

      this._data.push(row);
    }

    return this;
  }

  public secondaryTag(tag: Tags | AltSecondaryTag): Builder {
    this._checkExistingItem();
    const row = this._getCurrentRow();
    if (row !== undefined) {
      const item = row.pop();
      if (item === undefined) {
        throw new Error('Called "secondaryTag" without a CardRenderItem.');
      }
      if (!(item instanceof CardRenderItem)) {
        throw new Error('"secondaryTag" could be called on CardRenderItem only');
      }

      item.secondaryTag = tag;
      row.push(item);

      this._data.push(row);
    }

    return this;
  }
  public get brackets(): Builder {
    this._checkExistingItem();

    const row = this._getCurrentRow();
    if (row !== undefined) {
      const item = row.pop();
      if (!(item instanceof CardRenderItem)) {
        throw new Error('"brackets" could be called on CardRenderItem only');
      }

      if (item === undefined) {
        throw new Error('Called "brackets" without a CardRenderItem.');
      }
      row.push(CardRenderSymbol.bracketOpen());
      row.push(item);
      row.push(CardRenderSymbol.bracketClose());

      this._data.push(row);
    }

    return this;
  }

  /**
   * Used to start the effect for action(), effect() and standardProject(), also adds a delimiter symbol
   */
  public get startEffect(): Builder {
    this.br;
    this._addSymbol(CardRenderSymbol.colon());
    this.br;
    return this;
  }

  public get startAction(): Builder {
    this.br;
    this._addSymbol(CardRenderSymbol.arrow());
    this.br;
    return this;
  }
}

class ProductionBoxBuilder extends Builder {
  protected _data: Array<Array<CardRenderItem | CardRenderSymbol>> = [[]];

  public build(): CardRenderProductionBox {
    return new CardRenderProductionBox(this._data);
  }
}

class EffectBuilder extends Builder {
  protected _data: Array<Array<CardRenderItem | CardRenderSymbol | CardRenderProductionBox>> = [[]];

  public build(): CardRenderEffect {
    return new CardRenderEffect(this._data);
  }
}

class CorpEffectBuilderEffect extends Builder {
  protected _data: Array<Array<CardRenderEffect | CardRenderItem>> = [[]];

  public build(): CardRenderCorpBoxAction {
    return new CardRenderCorpBoxEffect(this._data);
  }
}

class CorpEffectBuilderAction extends Builder {
  protected _data: Array<Array<CardRenderEffect | CardRenderItem>> = [[]];

  public build(): CardRenderCorpBoxEffect {
    return new CardRenderCorpBoxAction(this._data);
  }
}
