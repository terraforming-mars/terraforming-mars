import {CardRenderItem} from './CardRenderItem';
import {CardRenderSymbol} from './CardRenderSymbol';
import {CardRenderItemSize} from './CardRenderItemSize';
import {CardRenderItemType} from './CardRenderItemType';
import {Tags} from '../Tags';
import {TileType} from '../../TileType';

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
    // TODO (chosta): validate builder method to make sure it's the last element
    return this.rows[2].slice(-1)[0];
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

  public oceans(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.OCEANS, amount));
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

  public titanium(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.TITANIUM, amount));
    return this;
  }

  public steel(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.STEEL, amount));
    return this;
  }

  public tr(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.TR, amount));
    return this;
  }

  public megacredits(amount: number): Builder {
    const item = new CardRenderItem(CardRenderItemType.MEGACREDITS, amount);
    item.amountInside = true;
    item.showDigit = false;
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

  public colonies(amount: number = 1, size: CardRenderItemSize = CardRenderItemSize.MEDIUM): Builder {
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

  public influence(amount: number): Builder {
    this._addRowItem(new CardRenderItem(CardRenderItemType.INFLUENCE, amount));
    return this;
  }

  public city(size: CardRenderItemSize = CardRenderItemSize.MEDIUM) {
    const item = new CardRenderItem(CardRenderItemType.CITY);
    item.size = size;
    this._addRowItem(item);
    return this;
  }

  public greenery(size: CardRenderItemSize = CardRenderItemSize.MEDIUM, withO2: boolean = false) {
    const item = new CardRenderItem(CardRenderItemType.GREENERY);
    item.size = size;
    if (withO2) {
      item.secondaryTag = 'oxygen';
    }
    this._addRowItem(item);
    return this;
  }

  public delegate(amount: number) {
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

  public selfReplicatingRobots() {
    this._addRowItem(new CardRenderItem(CardRenderItemType.SELF_REPLICATING));
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

  public emptyTile(type: 'normal' | 'golden' = 'normal') {
    if (type === 'normal') {
      this._addRowItem(new CardRenderItem(CardRenderItemType.EMPTY_TILE, -1));
    } else if (type === 'golden') {
      this._addRowItem(new CardRenderItem(CardRenderItemType.EMPTY_TILE_GOLDEN, -1));
    }
    return this;
  }

  public productionBox(pb: (builder: ProductionBoxBuilder) => void): Builder {
    this._addRowItem(CardRenderProductionBox.builder(pb));
    return this;
  }

  public effectBox(eb: (builder: EffectBuilder) => void): Builder {
    this._addRowItem(CardRenderEffect.builder(eb));
    return this;
  }

  public or(size: CardRenderItemSize = CardRenderItemSize.SMALL): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.or(size));
    return this;
  }

  public asterix(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.asterix(size));
    return this;
  }

  public plus(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.plus(size));
    return this;
  }

  public minus(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.minus(size));
    return this;
  }

  public slash(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.slash(size));
    return this;
  }

  public colon(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.colon(size));
    return this;
  }

  public arrow(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.arrow(size));
    return this;
  }

  public equals(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): Builder {
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
    this._addRowItem(item);
    return this;
  }

  public text(text: string, size: CardRenderItemSize = CardRenderItemSize.MEDIUM, uppercase: boolean = false): Builder {
    const item = new CardRenderItem(CardRenderItemType.TEXT);
    item.text = text;
    item.size = size;
    item.isUppercase = uppercase;
    this._addRowItem(item);
    return this;
  }

  public get br(): Builder {
    const newRow: Array<ItemType> = [];
    this._data.push(newRow);
    return this;
  }

  public tile(tile: TileType, hasSymbol: boolean, isAres: boolean = false): Builder {
    this._addTile(tile, hasSymbol, isAres);
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

  public secondaryTag(tag: Tags | 'req' | 'oxygen'): Builder {
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
   * Used to start the effect for effectBox and actionBox, also adds a delimiter symbol
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
