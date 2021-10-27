import {CardRenderItemType} from './CardRenderItemType';
import {CardRenderItem} from './CardRenderItem';
import {Size} from './Size';
import {ResourceType} from '../../ResourceType';

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
    const map: any = new Map([
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
    ]);
    const itemType = map.get(type);
    if (itemType === undefined) {
      throw new Error('Unknown item type ' + type);
    }
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(itemType), points, target);
  }
  public static microbes(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.MICROBES), points, target);
  }
  public static animals(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.ANIMALS), points, target);
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
  public static jovians(points: number, target: number): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.JOVIAN);
    item.isPlayed = true;

    return new CardRenderDynamicVictoryPoints(item, points, target);
  }
  public static floaters(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.FLOATERS), points, target);
  }
  public static searchForLife(): CardRenderDynamicVictoryPoints {
    const item = new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.SCIENCE), 3, 3);
    item.targetOneOrMore = true;
    return item;
  }
  public static fighter(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.FIGHTER), points, target);
  }
  public static camps(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.CAMPS), points, target);
  }
  public static venusianHabitats(points: number, target: number) {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.VENUSIAN_HABITAT), points, target);
  }
  public static specializedRobots(points: number, target: number) {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.SPECIALIZED_ROBOT), points, target);
  }
  public static colonies(points: number, target: number, any: boolean = false): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.COLONIES);
    item.size = Size.SMALL;
    item.anyPlayer = any;
    return new CardRenderDynamicVictoryPoints(item, points, target);
  }
  public static science(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.SCIENCE), points, target);
  }
  public static preservation(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.PRESERVATION), points, target);
  }
  public static resourceCube(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.RESOURCE_CUBE), points, target);
  }
  public static data(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.DATA_RESOURCE), points, target);
  }
  public static moon(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.MOON), points, target);
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
  public static venus(points: number, target: number): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.VENUS);
    item.isPlayed = true;
    item.size = Size.SMALL;
    return new CardRenderDynamicVictoryPoints(item, points, target);
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
