import {CardRenderItemType} from '../../../common/cards/render/CardRenderItemType';
import {ICardRenderDynamicVictoryPoints} from '../../../common/cards/render/ICardRenderDynamicVictoryPoints';
import {CardRenderItem} from './CardRenderItem';
import {Size} from '../../../common/cards/render/Size';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';

export class CardRenderDynamicVictoryPoints implements ICardRenderDynamicVictoryPoints {
  public targetOneOrMore: boolean | undefined; // marking target to be one or more res (Search for Life)
  public anyPlayer: boolean | undefined; // Law Suit
  public asterisk: boolean | undefined;
  public asFraction: boolean | undefined;
  public vermin: boolean | undefined;

  constructor(public item: CardRenderItem | undefined, public points: number, public target: number) {}

  public static resource(resource: CardResource, points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.RESOURCE, 1, {resource: resource}), points, target);
  }
  public static tag(tag: Tag, points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.TAG, 1, {tag: tag}), points, target);
  }
  public static oceans(points: number, target: number): CardRenderDynamicVictoryPoints {
    const inner = new CardRenderItem(CardRenderItemType.OCEANS, -1, {size: Size.SMALL});
    const item = new CardRenderDynamicVictoryPoints(inner, points, target);
    item.asterisk = true;
    return item;
  }
  public static cities(points: number, target: number, any: boolean = false, asterisk: boolean = false): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.CITY);
    item.size = Size.SMALL;
    item.anyPlayer = any;
    const vps = new CardRenderDynamicVictoryPoints(item, points, target);
    vps.asterisk = asterisk;
    return vps;
  }
  public static searchForLife(): CardRenderDynamicVictoryPoints {
    const item = new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.RESOURCE, 1, {resource: CardResource.SCIENCE}), 3, 3);
    item.targetOneOrMore = true;
    return item;
  }
  public static vermin() {
    const item = new CardRenderDynamicVictoryPoints(undefined, 0, 0);
    item.vermin = true;
    item.anyPlayer = true;
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
  public static moonHabitatTile(points: number): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.MOON_HABITAT);
    item.size = Size.SMALL;
    return new CardRenderDynamicVictoryPoints(item, points, 1);
  }
  public static moonRoadTile(points: number, any: boolean = false): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.MOON_ROAD);
    item.size = Size.SMALL;
    item.anyPlayer = any;
    return new CardRenderDynamicVictoryPoints(item, points, 1);
  }
  public static cathedral(): CardRenderDynamicVictoryPoints {
    const item = new CardRenderItem(CardRenderItemType.CATHEDRAL);
    return new CardRenderDynamicVictoryPoints(item, 1, 1);
  }
  public static questionmark(points: number = 0, per: number = 0): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(undefined, points, per);
  }
  public static any(points: number): CardRenderDynamicVictoryPoints {
    const item = new CardRenderDynamicVictoryPoints(undefined, points, points);
    item.anyPlayer = true;
    return item;
  }
  public static undergroundShelters(): CardRenderDynamicVictoryPoints {
    const item = new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.UNDERGROUND_SHELTERS), 1, 3);
    item.asterisk = true;
    item.asFraction = true;
    return item;
  }
}
