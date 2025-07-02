import {CardRenderItem, ItemOptions} from './CardRenderItem';
import {CardRenderSymbol} from './CardRenderSymbol';
import {Size} from '../../../common/cards/render/Size';
import {CardRenderItemType} from '../../../common/cards/render/CardRenderItemType';
import {TileType} from '../../../common/TileType';
import {ICardRenderCorpBoxAction, ICardRenderCorpBoxEffect, ICardRenderCorpBoxEffectAction, ICardRenderEffect, ICardRenderProductionBox, ICardRenderRoot, ICardRenderTile, ItemType, isICardRenderItem} from '../../../common/cards/render/Types';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';

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

  private validate(): this {
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

class CardRenderCorpBoxEffectAction implements ICardRenderCorpBoxEffectAction {
  public readonly is = 'corp-box-effect-action';
  constructor(public rows: Array<Array<ItemType>>) { }

  public static builder(f: (builder: CorpEffectBuilderEffectAction) => void): CardRenderCorpBoxEffectAction {
    const builder = new CorpEffectBuilderEffectAction();
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

  protected _appendToRow(thing: ItemType): this {
    if (this.superscript && isICardRenderItem(thing)) {
      thing.isSuperscript = true;
    }
    this._currentRow().push(thing);
    return this;
  }

  public temperature(amount: number, options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TEMPERATURE, amount, options));
  }

  public oceans(amount: number, options?: ItemOptions): this {
    // Is this necessary?
    const opts = options ?? {size: Size.MEDIUM};
    opts.size = opts.size ?? Size.MEDIUM;
    const item = new CardRenderItem(CardRenderItemType.OCEANS, amount, options);
    return this._appendToRow(item);
  }

  public oxygen(amount: number, options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.OXYGEN, amount, options));
  }

  public venus(amount: number, options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.VENUS, amount, options));
  }

  public plants(amount: number, options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.PLANTS, amount, options));
  }

  public heat(amount: number, options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.HEAT, amount, options));
  }

  public energy(amount: number, options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.ENERGY, amount, options));
  }

  public titanium(amount: number, options?: ItemOptions): this {
    const item = new CardRenderItem(CardRenderItemType.TITANIUM, amount, options);
    return this._appendToRow(item);
  }

  public steel(amount: number, options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.STEEL, amount, options));
  }

  public tr(amount: number, options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TR, amount, options));
  }

  public megacredits(amount: number, options?: ItemOptions): this {
    const item = new CardRenderItem(CardRenderItemType.MEGACREDITS, amount, options);
    item.amountInside = true;
    item.showDigit = false;
    item.size = options?.size ?? Size.MEDIUM;
    return this._appendToRow(item);
  }

  public cards(amount: number, options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.CARDS, amount, options));
  }

  public trade(options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TRADE, -1, options));
  }
  public tradeFleet(options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TRADE_FLEET, -1, options));
  }

  public colonies(amount: number = 1, options?: ItemOptions): this {
    const item = new CardRenderItem(CardRenderItemType.COLONIES, amount, options);
    item.size = options?.size ?? Size.MEDIUM;
    return this._appendToRow(item);
  }

  public tradeDiscount(amount: number): this {
    const item = new CardRenderItem(CardRenderItemType.TRADE_DISCOUNT, amount * -1);
    item.amountInside = true;
    return this._appendToRow(item);
  }

  public colonyTile(options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.COLONY_TILE, -1, options));
  }

  public influence(options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.INFLUENCE, 1, options));
  }

  public city(options?: ItemOptions) {
    const item = new CardRenderItem(CardRenderItemType.CITY, -1, options);
    item.size = options?.size ?? Size.MEDIUM;
    return this._appendToRow(item);
  }

  /**
   * Add a greenery.
   *
   * size: the tile size. Default is medium.
   * withO2: Show the superscript oxygen icon. Defualt is true.
   * any: for all players, Default is false.
   */
  public greenery(options?: {size?: Size, withO2?: boolean, any?: boolean}) {
    const item = new CardRenderItem(CardRenderItemType.GREENERY);
    item.size = options?.size ?? Size.MEDIUM;
    if (options?.withO2 !== false) {
      item.secondaryTag = AltSecondaryTag.OXYGEN;
    }
    if (options?.any === true) {
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

  public policy() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.POLICY));
  }

  public globalEvent() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.GLOBAL_EVENT));
  }

  public noTags() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.NO_TAGS, -1));
  }

  public emptyTag(count: number = 1) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.EMPTY_TAG, count));
  }

  public wild(amount: number, options?: ItemOptions) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.WILD, amount, options));
  }

  public one(amount: number, options?: ItemOptions) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.ONE, amount, options));
  }

  public diverseTag(amount: number = 1) {
    const item = new CardRenderItem(CardRenderItemType.DIVERSE_TAG, amount);
    return this._appendToRow(item);
  }

  public tag(tag: Tag, options?: number | ItemOptions) {
    const opts: ItemOptions = typeof(options) === 'number' ? {amount: options} : {...options};
    opts.tag = tag;
    return this._appendToRow(new CardRenderItem(CardRenderItemType.TAG, opts.amount, opts));
  }

  public resource(resource: CardResource, options?: number | ItemOptions) {
    let opts: ItemOptions;
    if (typeof(options) === 'number') {
      opts = {amount: options};
    } else {
      opts = {...options};
    }
    opts.resource = resource;
    return this._appendToRow(new CardRenderItem(CardRenderItemType.RESOURCE, -1, opts));
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

  public milestone(options?: ItemOptions | undefined) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MILESTONE, 1, options));
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

  public multiplierWhite() {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MULTIPLIER_WHITE));
  }

  public description(description: string | undefined = undefined): this {
    return this._appendToRow(description);
  }

  public moonHabitat(options?: ItemOptions | undefined): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_HABITAT, 1, options));
  }

  public moonHabitatRate(options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_HABITAT_RATE, 1, options));
  }

  // TODO(kberg): Replace moon road image with JUST a road, and add an altsecondary tag to support it.
  public moonRoad(options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_ROAD, 1, options));
  }

  public moonLogisticsRate(options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_LOGISTICS_RATE, 1, options));
  }

  public moonMine(options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_MINE, 1, options));
  }

  public moonMiningRate(options?: ItemOptions): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.MOON_MINING_RATE, 1, options));
  }

  public planetaryTrack(): this {
    this._appendToRow(new CardRenderItem(CardRenderItemType.PLANETARY_TRACK, 1));
    return this;
  }

  public cathedral(): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.CATHEDRAL, 1));
  }

  public nomads(): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.NOMADS, 1));
  }

  public specialTile(options?: ItemOptions) {
    this._appendToRow(new CardRenderItem(CardRenderItemType.EMPTY_TILE_SPECIAL, 1, options));
    return this;
  }

  public cityorSpecialTile(options?: ItemOptions) {
    const item = new CardRenderItem(CardRenderItemType.CITY_OR_SPECIAL_TILE, -1, options);
    item.size = options?.size ?? Size.MEDIUM;
    return this._appendToRow(item);
  }

  // Underworld
  public neutralDelegate(amount: number, options?: ItemOptions) {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.NEUTRAL_DELEGATE, amount, options));
  }

  public identify(count: number = 1, options?: ItemOptions) {
    const item = new CardRenderItem(CardRenderItemType.IDENTIFY, count, options);
    return this._appendToRow(item);
  }

  public excavate(count: number = 1, options?: ItemOptions) {
    const item = new CardRenderItem(CardRenderItemType.EXCAVATE, count, options);
    return this._appendToRow(item);
  }

  public corruption(count: number = 1, options?: ItemOptions) {
    const item = new CardRenderItem(CardRenderItemType.CORRUPTION, count, options);
    return this._appendToRow(item);
  }

  public undergroundResources(count: number = 1, options?: ItemOptions) {
    const item = new CardRenderItem(CardRenderItemType.UNDERGROUND_RESOURCES, count, options);
    return this._appendToRow(item);
  }

  public corruptionShield() {
    const item = new CardRenderItem(CardRenderItemType.CORRUPTION_SHIELD);
    return this._appendToRow(item);
  }

  public geoscan() {
    const item = new CardRenderItem(CardRenderItemType.GEOSCAN_ICON, 1, {});
    return this._appendToRow(item);
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

  public production(pb: (builder: ProductionBoxBuilder) => void): this {
    return this._appendToRow(CardRenderProductionBox.builder(pb));
  }

  public standardProject(description: string, eb: (builder: EffectBuilder) => void): this {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description;
    return this._appendToRow(builder);
  }

  public action(description: string | undefined, eb: (builder: EffectBuilder) => void): this {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description !== undefined ? 'Action: ' + description : undefined;
    return this._appendToRow(builder);
  }

  public effect(description: string | undefined, eb: (builder: EffectBuilder) => void): this {
    const builder = CardRenderEffect.builder(eb);
    builder.description = description !== undefined ? 'Effect: ' + description : undefined;
    return this._appendToRow(builder);
  }

  public corpBox(type: 'action' | 'effect' | 'effect-action', eb: (builder: CorpEffectBuilderEffect | CorpEffectBuilderAction | CorpEffectBuilderEffectAction) => void): this {
    this.br;
    if (type === 'action') {
      return this._appendToRow(CardRenderCorpBoxAction.builder(eb));
    } else if (type === 'effect'){
      return this._appendToRow(CardRenderCorpBoxEffect.builder(eb));
    } else {
      return this._appendToRow(CardRenderCorpBoxEffectAction.builder(eb));
    }
  }

  public or(size: Size = Size.SMALL): this {
    return this._appendToRow(CardRenderSymbol.or(size));
  }

  public asterix(size: Size = Size.MEDIUM): this {
    return this._appendToRow(CardRenderSymbol.asterix(size));
  }

  public plus(size: Size = Size.MEDIUM): this {
    return this._appendToRow(CardRenderSymbol.plus(size));
  }

  public minus(size: Size = Size.MEDIUM): this {
    return this._appendToRow(CardRenderSymbol.minus(size));
  }

  public slash(size: Size = Size.MEDIUM): this {
    return this._appendToRow(CardRenderSymbol.slash(size));
  }

  public colon(size: Size = Size.MEDIUM): this {
    return this._appendToRow(CardRenderSymbol.colon(size));
  }

  public arrow(size: Size = Size.MEDIUM): this {
    return this._appendToRow(CardRenderSymbol.arrow(size));
  }

  public equals(size: Size = Size.MEDIUM): this {
    return this._appendToRow(CardRenderSymbol.equals(size));
  }

  public surveyMission(): this {
    return this._appendToRow(CardRenderSymbol.surveyMission());
  }

  public empty(): this {
    return this._appendToRow(CardRenderSymbol.empty());
  }

  public plate(text: string, options?: ItemOptions | undefined): this {
    const item = new CardRenderItem(CardRenderItemType.PLATE, 1, options);
    item.text = text;
    item.isPlate = true;
    item.isBold = true;
    return this._appendToRow(item);
  }

  public text(text: string, size: Size = Size.MEDIUM, uppercase: boolean = false, isBold: boolean = true): this {
    const item = new CardRenderItem(CardRenderItemType.TEXT);
    item.text = text;
    item.size = size;
    item.isUppercase = uppercase;
    item.isBold = isBold;
    return this._appendToRow(item);
  }

  public text2(text: string, options: {size?: Size, caps?: boolean, bold?: boolean, all?: boolean}) {
    const item = new CardRenderItem(CardRenderItemType.TEXT);
    item.text = text;
    item.size = options.size || Size.MEDIUM;
    item.isUppercase = options.caps || false;
    item.isBold = options.bold || true;
    item.anyPlayer = options.all;
    return this._appendToRow(item);
  }

  public plainText(text: string) {
    return this.text(text, Size.SMALL, false, false);
  }

  public vpText(text: string): this {
    return this.text(text, Size.TINY, true);
  }

  public get br(): this {
    this._data.push([]);
    return this;
  }

  public tile(tile: TileType, hasSymbol: boolean = false, isAres: boolean = false): this {
    return this._appendToRow(new CardRenderTile(tile, hasSymbol, isAres));
  }

  /*
   * A one off function to handle Project Requirements prelude card
   */
  public projectRequirements(): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.IGNORE_GLOBAL_REQUIREMENTS));
  }

  /**
   * add non breakable space or simply empty space between items
   */
  public get nbsp(): this {
    return this._appendToRow(CardRenderSymbol.nbsp());
  }

  /*
   * add non breakable vertical space (a div with different pixels height)
   */
  public vSpace(size: Size = Size.MEDIUM): this {
    return this._appendToRow(CardRenderSymbol.vSpace(size));
  }

  private superscript = false;

  public super(sb: (builder: this) => void): this {
    this._appendToRow(CardRenderSymbol.bracketOpen());
    this.superscript = true;
    sb(this);
    this.superscript = false;
    this._appendToRow(CardRenderSymbol.bracketClose());
    return this;
  }

  /**
   * Used to start the effect for action(), effect() and standardProject(), also adds a delimiter symbol
   */
  public get startEffect(): this {
    this.br;
    this._appendToRow(CardRenderSymbol.colon());
    this.br;
    return this;
  }

  public get startAction(): this {
    this.br;
    this._appendToRow(CardRenderSymbol.arrow());
    this.br;
    return this;
  }

  /**
   * CEO Card Assets
   */
  public opgArrow(): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.ARROW_OPG));
  }
  // Reds icons used by Zan
  public reds(): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.REDS));
  }
  public redsInactive(): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.REDS_DEACTIVATED));
  }
  // Hazard tiles for Caesar
  public hazardTile(amount: number = 1, options?: ItemOptions | undefined): this {
    return this._appendToRow(new CardRenderItem(CardRenderItemType.HAZARD_TILE, amount, options));
  }
  public adjacencyBonus(): this {
    this._appendToRow(new CardRenderItem(CardRenderItemType.ADJACENCY_BONUS));
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

class CorpEffectBuilderEffectAction extends Builder<CardRenderCorpBoxEffectAction> {
  public override build(): CardRenderCorpBoxEffectAction {
    return new CardRenderCorpBoxEffectAction(this._data);
  }
}
