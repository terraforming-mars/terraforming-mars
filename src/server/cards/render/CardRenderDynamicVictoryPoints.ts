import {CardRenderItemType} from '../../../common/cards/render/CardRenderItemType';
import {ICardRenderDynamicVictoryPoints} from '../../../common/cards/render/ICardRenderDynamicVictoryPoints';
import {CardRenderItem} from './CardRenderItem';
import {Size} from '../../../common/cards/render/Size';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';

const RESOURCE_TO_ITEM_TYPE: Record<CardResource, CardRenderItemType | undefined> = {
  [CardResource.MICROBE]: CardRenderItemType.MICROBES,
  [CardResource.ANIMAL]: CardRenderItemType.ANIMALS,
  [CardResource.CAMP]: CardRenderItemType.CAMPS,
  [CardResource.DATA]: CardRenderItemType.DATA_RESOURCE,
  [CardResource.SCIENCE]: CardRenderItemType.SCIENCE,
  [CardResource.RESOURCE_CUBE]: CardRenderItemType.RESOURCE_CUBE,
  [CardResource.PRESERVATION]: CardRenderItemType.PRESERVATION,
  [CardResource.ASTEROID]: CardRenderItemType.ASTEROIDS,
  [CardResource.FIGHTER]: CardRenderItemType.FIGHTER,
  [CardResource.FLOATER]: CardRenderItemType.FLOATERS,
  [CardResource.VENUSIAN_HABITAT]: CardRenderItemType.VENUSIAN_HABITAT,
  [CardResource.SPECIALIZED_ROBOT]: CardRenderItemType.SPECIALIZED_ROBOT,
  [CardResource.HYDROELECTRIC_RESOURCE]: CardRenderItemType.HYDROELECTRIC_RESOURCE,
  [CardResource.CLONE_TROOPER]: CardRenderItemType.CLONE_TROOPER,
  [CardResource.JOURNALISM]: CardRenderItemType.JOURNALISM,
  [CardResource.DISEASE]: undefined,
  [CardResource.SYNDICATE_FLEET]: undefined,
  [CardResource.SEED]: undefined,
  [CardResource.AGENDA]: undefined,
  [CardResource.ORBITAL]: undefined,
  [CardResource.GRAPHENE]: undefined,
  [CardResource.TOOL]: undefined,
  [CardResource.WARE]: undefined,
  [CardResource.SCOOP]: undefined,
  [CardResource.ACTIVIST]: undefined,
};

const TAG_TO_ITEM_TYPE = new Map<Tag, CardRenderItemType>([
  [Tag.JOVIAN, CardRenderItemType.JOVIAN],
  [Tag.MOON, CardRenderItemType.MOON],
  [Tag.VENUS, CardRenderItemType.VENUS],
]);

export class CardRenderDynamicVictoryPoints implements ICardRenderDynamicVictoryPoints {
  public targetOneOrMore: boolean = false; // marking target to be one or more res (Search for Life)
  public anyPlayer: boolean = false; // Law Suit
  constructor(public item: CardRenderItem | undefined, public points: number, public target: number) {}

  public static resource(type: CardResource, points: number, target: number): CardRenderDynamicVictoryPoints {
    const itemType = RESOURCE_TO_ITEM_TYPE[type];
    if (itemType === undefined) {
      throw new Error('Unknown item type ' + type);
    }
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(itemType), points, target);
  }
  public static tag(type: Tag, points: number, target: number): CardRenderDynamicVictoryPoints {
    const itemType = TAG_TO_ITEM_TYPE.get(type);
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
}
