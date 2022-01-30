import {CardRenderItemType} from './CardRenderItemType';
import {CardRenderItem} from './CardRenderItem';
import {Size} from './Size';
import {ResourceType} from '../../common/ResourceType';
import {Tags} from '../../common/cards/Tags';

const RESOURCE_TO_ITEM_TYPE = new Map([
  [ResourceType.MICROBE, CardRenderItemType.MICROBES],
  [ResourceType.ANIMAL, CardRenderItemType.ANIMALS],
  [ResourceType.CAMP, CardRenderItemType.CAMPS],
  [ResourceType.DATA, CardRenderItemType.DATA_RESOURCE],
  [ResourceType.SCIENCE, CardRenderItemType.SCIENCE],
  [ResourceType.RESOURCE_CUBE, CardRenderItemType.RESOURCE_CUBE],
  [ResourceType.PRESERVATION, CardRenderItemType.PRESERVATION],
  [ResourceType.ASTEROID, CardRenderItemType.ASTEROIDS],
  [ResourceType.FIGHTER, CardRenderItemType.FIGHTER],
  [ResourceType.FLOATER, CardRenderItemType.FLOATERS],
  [ResourceType.VENUSIAN_HABITAT, CardRenderItemType.VENUSIAN_HABITAT],
  [ResourceType.SPECIALIZED_ROBOT, CardRenderItemType.SPECIALIZED_ROBOT],
]);

export class CardRenderDynamicVictoryPoints {
  public targetOneOrMore: boolean = false; // marking target to be one or more res (Search for Life)
  public anyPlayer: boolean = false; // Law Suit
  constructor(public item: CardRenderItem | undefined, public points: number, public target: number) {}

  public getPointsHtml(): string {
    if (this.item === undefined && this.points === 0 && this.target === 0) return '?';
    if (this.item === undefined) return `${this.points}`;
    if (this.target === this.points || this.target === 1) return `${this.points}/`;
    return `${this.points}/${this.target}`;
  }
  public static asteroids(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.ASTEROIDS), points, target);
  }

  // Remove all of the builder methods; they're no longer necessary. Keep some
  // version of the tests, though.
  public static resource(type: ResourceType, points: number, target: number): CardRenderDynamicVictoryPoints {
    const itemType = RESOURCE_TO_ITEM_TYPE.get(type);
    if (itemType === undefined) {
      throw new Error('Unknown item type ' + type);
    }
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(itemType), points, target);
  }
  public static tag(type: Tags, points: number, target: number): CardRenderDynamicVictoryPoints {
    const map = new Map<Tags, CardRenderItemType>([
      [Tags.JOVIAN, CardRenderItemType.JOVIAN],
      [Tags.MOON, CardRenderItemType.MOON],
      [Tags.VENUS, CardRenderItemType.VENUS],
    ]);
    const itemType = map.get(type);
    if (itemType === undefined) {
      throw new Error('Unknown item type ' + type);
    }
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(itemType, 1, {played: true}), points, target);
  }
  public static oceans(points: number, target: number): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.OCEANS);
    item.size = Size.SMALL;
    return new CardRenderDynamicVictoryPoints(item, points, target);
  }
  public static cities(points: number, target: number, any: boolean = false): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.CITY);
    item.size = Size.SMALL;
    item.anyPlayer = any;
    return new CardRenderDynamicVictoryPoints(item, points, target);
  }
  public static searchForLife(): CardRenderDynamicVictoryPoints {
    const item = new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.SCIENCE), 3, 3);
    item.targetOneOrMore = true;
    return item;
  }
  public static colonies(points: number, target: number, any: boolean = false): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.COLONIES);
    item.size = Size.SMALL;
    item.anyPlayer = any;
    return new CardRenderDynamicVictoryPoints(item, points, target);
  }
  public static moonMiningTile(points: number, any: boolean = false): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.MOON_MINE);
    item.size = Size.SMALL;
    item.anyPlayer = any;
    return new CardRenderDynamicVictoryPoints(item, points, points);
  }
  public static moonColonyTile(points: number): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.MOON_COLONY);
    item.size = Size.SMALL;
    return new CardRenderDynamicVictoryPoints(item, points, 1);
  }
  public static moonRoadTile(points: number, any: boolean = false): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.MOON_ROAD);
    item.size = Size.SMALL;
    item.anyPlayer = any;
    return new CardRenderDynamicVictoryPoints(item, points, 1);
  }
  public static questionmark(): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(undefined, 0, 0);
  }
  public static any(points: number): CardRenderDynamicVictoryPoints {
    const item = new CardRenderDynamicVictoryPoints(undefined, points, points);
    item.anyPlayer = true;
    return item;
  }
}
