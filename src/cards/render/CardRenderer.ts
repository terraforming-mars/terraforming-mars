import { CardRenderItem } from "./CardRenderItem";
import { CardRenderItemType } from "./CardRenderItemType";

type ItemType = CardRenderItem | CardRenderProductionBox | undefined;

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
    constructor(rows: Array<Array<CardRenderItem>>) {
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

    public br(): Builder {
        const newRow: Array<ItemType> = [];
        this._data.push(newRow);
        return this;
    }

    public any(): Builder {
        // #TODO (chosta): functions to validate data
        if (this._data.length === 0) {
            throw new Error("No items in builder data to call any()");
        }

        // #TODO (chosta): this could be possibly improved
        const row = this.getCurrentRow();
        if (row !== undefined) {
            const item = row?.pop();
            if (!(item instanceof CardRenderItem)) {
                throw new Error("Any() could be called on CardRenderItem only");
            }

            if (item === undefined) {
                throw new Error("Called any() without a CardRenderItem.");
            }

            row?.push(item.any());
            this._data.push(row);
        }

        return this;
    }
}

class ProductionBoxBuilder extends Builder {
    protected _data: Array<Array<CardRenderItem>> = [[]];

    public build(): CardRenderProductionBox {
        return new CardRenderProductionBox(this._data);
    }
}
