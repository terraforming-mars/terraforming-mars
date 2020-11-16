import {CardRenderItem} from './CardRenderItem';
import {CardRenderSymbol} from './CardRenderSymbol';
import {CardRenderItemSize} from './CardRenderItemSize';
import {CardRenderItemType} from './CardRenderItemType';

type ItemType = CardRenderItem | CardRenderProductionBox | CardRenderSymbol | undefined;

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

class Builder {
  protected _data: Array<Array<ItemType>> = [[]];

  public build(): CardRenderer {
    return new CardRenderer(this._data);
  }

  public getCurrentRow(): Array<ItemType> | undefined {
    return this._data.pop();
  }

  public addRowItem(item: ItemType): void {
    const currentRow = this.getCurrentRow();
    if (currentRow !== undefined) {
      currentRow.push(item);
      this._data.push(currentRow);
    }
  }

  public temperature(amount: number): Builder {
    this.addRowItem(new CardRenderItem(CardRenderItemType.TEMPERATURE, amount));
    return this;
  }

  public oceans(amount: number): Builder {
    this.addRowItem(new CardRenderItem(CardRenderItemType.OCEANS, amount));
    return this;
  }

  public oxygen(amount: number): Builder {
    this.addRowItem(new CardRenderItem(CardRenderItemType.OXYGEN, amount));
    return this;
  }

  public venus(amount: number): Builder {
    this.addRowItem(new CardRenderItem(CardRenderItemType.VENUS, amount));
    return this;
  }

  public plants(amount: number): Builder {
    this.addRowItem(new CardRenderItem(CardRenderItemType.PLANTS, amount));
    return this;
  }

  public microbes(amount: number): Builder {
    this.addRowItem(new CardRenderItem(CardRenderItemType.MICROBES, amount));
    return this;
  }

  public productionBox(pb: (builder: ProductionBoxBuilder) => void): Builder {
    this.addRowItem(CardRenderProductionBox.builder(pb));
    return this;
  }

  public heat(amount: number): Builder {
    this.addRowItem(new CardRenderItem(CardRenderItemType.HEAT, amount));
    return this;
  }

  public energy(amount: number): Builder {
    this.addRowItem(new CardRenderItem(CardRenderItemType.ENERGY, amount));
    return this;
  }

  public titanium(amount: number): Builder {
    this.addRowItem(new CardRenderItem(CardRenderItemType.TITANIUM, amount));
    return this;
  }

  public megacredits(amount: number): Builder {
    const item = new CardRenderItem(CardRenderItemType.MEGACREDITS, amount);
    item.amountInside = true;
    this.addRowItem(item);
    return this;
  }

  public get br(): Builder {
    const newRow: Array<ItemType> = [];
    this._data.push(newRow);
    return this;
  }

  protected _checkExistingItem(): void {
    if (this._data.length === 0) {
      throw new Error('No items in builder data!');
    }
  }

  protected _addSymbol(Symbol: CardRenderSymbol): void {
    const row = this.getCurrentRow();
    if (row !== undefined) {
      row.push(Symbol);
      this._data.push(row);
    }
  }

  public or(size: CardRenderItemSize = CardRenderItemSize.MEDIUM): Builder {
    this._checkExistingItem();
    this._addSymbol(CardRenderSymbol.asterix(size));

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

  public get any(): Builder {
    this._checkExistingItem();

    const row = this.getCurrentRow();
    if (row !== undefined) {
      const item = row?.pop();
      if (!(item instanceof CardRenderItem)) {
        throw new Error('Any() could be called on CardRenderItem only');
      }

      if (item === undefined) {
        throw new Error('Called any() without a CardRenderItem.');
      }
      item.anyPlayer = true;
      row?.push(item);
      this._data.push(row);
    }

    return this;
  }
}

class ProductionBoxBuilder extends Builder {
  protected _data: Array<Array<CardRenderItem | CardRenderSymbol>> = [[]];

  public build(): CardRenderProductionBox {
    return new CardRenderProductionBox(this._data);
  }
}
