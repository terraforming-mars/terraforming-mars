import {CardRenderItem, ItemOptions} from './CardRenderItem';
import {CardRenderSymbol} from './CardRenderSymbol';
import {Size} from '../../../common/cards/render/Size';
import {CardRenderItemType} from '../../../common/cards/render/CardRenderItemType';
import {TileType} from '../../../common/TileType';
import {ICardRenderCorpBoxAction, ICardRenderCorpBoxEffect, ICardRenderEffect, ICardRenderProductionBox, ICardRenderRoot, ICardRenderTile, ItemType} from '../../../common/cards/render/Types';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class CardRenderer {
  public static builder(f: (builder: Builder<CardRenderRoot>) => void): ICardRenderRoot {
    const builder = new RootBuilder();
    f(builder);
    return builder.build();
  }
}

class CardRenderRoot implements ICardRenderRoot {
  public readonly is ='root';
  constructor(public rows: Array<Array<ItemType>> = [[]]) {}
}

class CardRenderProductionBox implements ICardRenderProductionBox {
  public readonly is = 'production-box';
  constructor(public rows: Array<Array<ItemType>>) {}

  public static builder(f: (builder: ProductionBoxBuilder) => void): CardRenderProductionBox {
    const builder = new ProductionBoxBuilder();
    f(builder);
    return builder.build();
  }
}

class CardRenderTile implements ICardRenderTile {
  public readonly is = 'tile';
  constructor(public tile: TileType, public hasSymbol: boolean, public isAres: boolean) { }
}

class CardRenderEffect implements ICardRenderEffect {
  public readonly is = 'effect';
  constructor(public rows: Array<Array<ItemType>>) {}

  public static builder(f: (builder: EffectBuilder) => void): CardRenderEffect {
    const builder = new EffectBuilder();
    f(builder);
    return builder.build().validate();
  }

  private validate() {
    if (this.rows.length !== 3) {
      throw new Error('Card effect must have 3 arrays representing cause, delimiter and effect. If there is no cause, start with `empty`.');
    }
    if (this.rows[1].length !== 1) {
      throw new Error('Card effect delimiter array must contain exactly 1 item');
    }
    if (!(this.rows[1][0] instanceof CardRenderSymbol)) {
      throw new Error('Effect delimiter must be a symbol');
    }
    return this;
  }

  public set description(content: ItemType) {
    this.rows[2].push(content);
  }
}

class CardRenderCorpBoxEffect implements ICardRenderCorpBoxEffect {
  public readonly is = 'corp-box-effect';
  constructor(public rows: Array<Array<ItemType>>) { }

  public static builder(f: (builder: CorpEffectBuilderEffect) => void): CardRenderCorpBoxEffect {
    const builder = new CorpEffectBuilderEffect();
    f(builder);
    return builder.build();
  }
}

class CardRenderCorpBoxAction implements ICardRenderCorpBoxAction {
  public readonly is = 'corp-box-action';
  constructor(public rows: Array<Array<ItemType>>) { }

  public static builder(f: (builder: CorpEffectBuilderAction) => void): CardRenderCorpBoxAction {
    const builder = new CorpEffectBuilderAction();
    f(builder);
    return builder.build();
  }
}


abstract class Builder<T> {
  protected _data: Array<Array<ItemType>> = [[]];

  public abstract build(): T;

  protected _currentRow(): Array<ItemType> {
    if (this._data.length === 0) {
      throw new Error('No items in builder data!');
    }
    return this._data[this._data.length - 1];
  }

  protected _appendToRow(thing: ItemType) {
    this._currentRow().push(thing);
    return this;
  }

  public temperature(amount: number): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TEMPERATURE, amount));
  }

  public oceans(amount: number, options?: ItemOptions): Builder<T> {
    // Is this necessary?
    const opts = options ?? {size: Size.MEDIUM};
    opts.size = opts.size ?? Size.MEDIUM;
    const item = new CardRenderItem(CardRenderItemType.OCEANS, amount, options);
    return this._appendToRow(item);
  }

  public oxygen(amount: number): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.OXYGEN, amount));
  }

  public venus(amount: number, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.VENUS, amount, options));
  }

  public plants(amount: number, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.PLANTS, amount, options));
  }

  public microbes(amount: number, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MICROBES, amount, options));
  }

  public animals(amount: number, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.ANIMALS, amount, options));
  }

  public heat(amount: number, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.HEAT, amount, options));
  }

  public energy(amount: number, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.ENERGY, amount, options));
  }

  public titanium(amount: number, options?: ItemOptions): Builder<T> {
    const item = new CardRenderItem(CardRenderItemType.TITANIUM, amount, options);
    return this._appendToRow(item);
  }

  public steel(amount: number, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.STEEL, amount, options));
  }

  public tr(amount: number, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TR, amount, options));
  }

  public megacredits(amount: number, options?: ItemOptions): Builder<T> {
    const item = new CardRenderItem(CardRenderItemType.MEGACREDITS, amount, options);
    item.amountInside = true;
    item.showDigit = false;
    item.size = options?.size ?? Size.MEDIUM;
    return this._appendToRow(item);
  }

  public cards(amount: number, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.CARDS, amount, options));
  }

  public floaters(amount: number, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.FLOATERS, amount, options));
  }

  public asteroids(amount: number, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.ASTEROIDS, amount, options));
  }

  public event(options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.EVENT, -1, options));
  }

  public space(options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.SPACE, -1, options));
  }

  public earth(amount: number = -1, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.EARTH, amount, options));
  }

  public building(amount: number = -1, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.BUILDING, amount, options));
  }

  public jovian(options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.JOVIAN, -1, options));
  }

  public science(amount: number = 1, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.SCIENCE, amount, options));
  }

  public trade(options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TRADE, -1, options));
  }
  public tradeFleet(): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TRADE_FLEET));
  }

  public colonies(amount: number = 1, options?: ItemOptions): Builder<T> {
    const item = new CardRenderItem(CardRenderItemType.COLONIES, amount, options);
    item.size = options?.size ?? Size.MEDIUM;
    return this._appendToRow(item);
  }

  public tradeDiscount(amount: number): Builder<T> {
    const item = new CardRenderItem(CardRenderItemType.TRADE_DISCOUNT, amount * -1);
    item.amountInside = true;
    return this._appendToRow(item);
  }

  public placeColony(options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.PLACE_COLONY, -1, options));
  }

  public influence(options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.INFLUENCE, 1, options));
  }

  public city(options?: ItemOptions) {
    const item = new CardRenderItem(CardRenderItemType.CITY, -1, options);
    item.size = options?.size ?? Size.MEDIUM;
    return this._appendToRow(item);
  }

  public greenery(size: Size = Size.MEDIUM, withO2: boolean = true, any: boolean = false) {
    const item = new CardRenderItem(CardRenderItemType.GREENERY);
    item.size = size;
    if (withO2) {
      item.secondaryTag = AltSecondaryTag.OXYGEN;
    }
    if (any === true) {
      item.anyPlayer = true;
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

  public corporation() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.CORPORATION));
  }

  public firstPlayer() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.FIRST_PLAYER));
  }

  public rulingParty() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.RULING_PARTY));
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

  public venusianHabitat(amount: number): Builder<T> {
    this._appendToRow(new CardRenderItem(CardRenderItemType.VENUSIAN_HABITAT, amount));
    return this;
  }

  public specializedRobot(amount: number): Builder<T> {
    this._appendToRow(new CardRenderItem(CardRenderItemType.SPECIALIZED_ROBOT, amount));
    return this;
  }

  public agenda(options?: ItemOptions | undefined): Builder<T> {
    this._appendToRow(new CardRenderItem(CardRenderItemType.AGENDA, 1, options));
    return this;
  }

  public multiplierWhite() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MULTIPLIER_WHITE));
  }

  public description(description: string | undefined = undefined): Builder<T> {
    return this._appendToRow(description);
  }

  public moon(amount: number = -1, options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON, amount, options));
  }

  public resourceCube(amount = 1): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.RESOURCE_CUBE, amount));
  }

  public moonHabitat(options?: ItemOptions | undefined): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_HABITAT, 1, options));
  }

  public moonHabitatRate(options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_HABITAT_RATE, 1, options));
  }

  // TODO(kberg): Replace moon road image with JUST a road, and add an altsecondary tag to support it.
  public moonRoad(options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_ROAD, 1, options));
  }

  public moonLogisticsRate(options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_LOGISTICS_RATE, 1, options));
  }

  public moonMine(options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_MINE, 1, options));
  }

  public moonMiningRate(options?: ItemOptions): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_MINING_RATE, 1, options));
  }

  public syndicateFleet(amount: number = 1): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.SYNDICATE_FLEET, amount));
  }

  public mars(amount: number, options?: ItemOptions): Builder<T> {
    this._appendToRow(new CardRenderItem(CardRenderItemType.MARS, amount, options));
    return this;
  }

  public planetaryTrack(): Builder<T> {
    this._appendToRow(new CardRenderItem(CardRenderItemType.PLANETARY_TRACK, 1));
    return this;
  }

  public seed(): Builder<T> {
    this._appendToRow(new CardRenderItem(CardRenderItemType.SEED, 1));
    return this;
  }

  public orbital(): Builder<T> {
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

  public production(pb: (builder: ProductionBoxBuilder) => void): Builder<T> {
    return this._appendToRow(CardRenderProductionBox.builder(pb));
  }

  public standardProject(description: string, eb: (builder: EffectBuilder) => void): Builder<T> {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description;
    return this._appendToRow(builder);
  }

  public action(description: string | undefined, eb: (builder: EffectBuilder) => void): Builder<T> {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description !== undefined ? 'Action: ' + description : undefined;
    return this._appendToRow(builder);
  }

  public effect(description: string | undefined, eb: (builder: EffectBuilder) => void): Builder<T> {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description !== undefined ? 'Effect: ' + description : undefined;
    return this._appendToRow(builder);
  }

  public corpBox(type: 'action' | 'effect', eb: (builder: CorpEffectBuilderEffect | CorpEffectBuilderAction) => void): Builder<T> {
    this.br;
    if (type === 'action') {
      return this._appendToRow(CardRenderCorpBoxAction.builder(eb));
    } else {
      return this._appendToRow(CardRenderCorpBoxEffect.builder(eb));
    }
  }

  public or(size: Size = Size.SMALL): Builder<T> {
    return this._appendToRow(CardRenderSymbol.or(size));
  }

  public asterix(size: Size = Size.MEDIUM): Builder<T> {
    return this._appendToRow(CardRenderSymbol.asterix(size));
  }

  public plus(size: Size = Size.MEDIUM): Builder<T> {
    return this._appendToRow(CardRenderSymbol.plus(size));
  }

  public minus(size: Size = Size.MEDIUM): Builder<T> {
    return this._appendToRow(CardRenderSymbol.minus(size));
  }

  public slash(size: Size = Size.MEDIUM): Builder<T> {
    return this._appendToRow(CardRenderSymbol.slash(size));
  }

  public colon(size: Size = Size.MEDIUM): Builder<T> {
    return this._appendToRow(CardRenderSymbol.colon(size));
  }

  public arrow(size: Size = Size.MEDIUM): Builder<T> {
    return this._appendToRow(CardRenderSymbol.arrow(size));
  }

  public equals(size: Size = Size.MEDIUM): Builder<T> {
    return this._appendToRow(CardRenderSymbol.equals(size));
  }

  public surveyMission(): Builder<T> {
    return this._appendToRow(CardRenderSymbol.surveyMission());
  }

  public empty(): Builder<T> {
    return this._appendToRow(CardRenderSymbol.empty());
  }

  public plate(text: string): Builder<T> {
    const item = new CardRenderItem(CardRenderItemType.PLATE);
    item.text = text;
    item.isPlate = true;
    item.isBold = true;
    return this._appendToRow(item);
  }

  public text(text: string, size: Size = Size.MEDIUM, uppercase: boolean = false, isBold: boolean = true): Builder<T> {
    const item = new CardRenderItem(CardRenderItemType.TEXT);
    item.text = text;
    item.size = size;
    item.isUppercase = uppercase;
    item.isBold = isBold;
    return this._appendToRow(item);
  }

  public vpText(text: string): Builder<T> {
    return this.text(text, Size.TINY, true);
  }

  public get br(): Builder<T> {
    this._data.push([]);
    return this;
  }

  public tile(tile: TileType, hasSymbol: boolean = false, isAres: boolean = false): Builder<T> {
    return this._appendToRow(new CardRenderTile(tile, hasSymbol, isAres));
  }

  /*
   * A one off function to handle Project Requirements prelude card
   */
  public projectRequirements(): Builder<T> {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.IGNORE_GLOBAL_REQUIREMENTS));
  }

  /**
   * add non breakable space or simply empty space between items
   */
  public get nbsp(): Builder<T> {
    return this._appendToRow(CardRenderSymbol.nbsp());
  }

  /*
   * add non breakable vertical space (a div with different pixels height)
   */
  public vSpace(size: Size = Size.MEDIUM): Builder<T> {
    return this._appendToRow(CardRenderSymbol.vSpace(size));
  }

  public get openBrackets(): Builder<T> {
    return this._appendToRow(CardRenderSymbol.bracketOpen());
  }

  public get closeBrackets(): Builder<T> {
    return this._appendToRow(CardRenderSymbol.bracketClose());
  }

  /**
   * Used to start the effect for action(), effect() and standardProject(), also adds a delimiter symbol
   */
  public get startEffect(): Builder<T> {
    this.br;
    this._appendToRow(CardRenderSymbol.colon());
    this.br;
    return this;
  }

  public get startAction(): Builder<T> {
    this.br;
    this._appendToRow(CardRenderSymbol.arrow());
    this.br;
    return this;
  }
}

class RootBuilder extends Builder<CardRenderRoot> {
  public override build(): CardRenderRoot {
    return new CardRenderRoot(this._data);
  }
}

class ProductionBoxBuilder extends Builder<CardRenderProductionBox> {
  public override build(): CardRenderProductionBox {
    return new CardRenderProductionBox(this._data);
  }
}

class EffectBuilder extends Builder<CardRenderEffect> {
  public override build(): CardRenderEffect {
    return new CardRenderEffect(this._data);
  }
}

class CorpEffectBuilderEffect extends Builder<CardRenderCorpBoxEffect> {
  public override build(): CardRenderCorpBoxEffect {
    return new CardRenderCorpBoxEffect(this._data);
  }
}

class CorpEffectBuilderAction extends Builder<CardRenderCorpBoxAction> {
  public override build(): CardRenderCorpBoxAction {
    return new CardRenderCorpBoxAction(this._data);
  }
}
