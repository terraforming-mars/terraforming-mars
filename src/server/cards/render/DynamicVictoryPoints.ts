import {CardRenderItemType} from '../../../common/cards/render/CardRenderItemType';
import {CardRenderDynamicVictoryPoints} from '../../../common/cards/render/CardRenderDynamicVictoryPoints';
import {CardRenderItem} from './CardRenderItem';
import {Size} from '../../../common/cards/render/Size';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';

export function resource(resource: CardResource, points: number, target: number): CardRenderDynamicVictoryPoints {
  return {
    item: new CardRenderItem(CardRenderItemType.RESOURCE, 1, {resource: resource}),
    points: points,
    target: target,
  };
}
export function tag(tag: Tag, points: number, target: number): CardRenderDynamicVictoryPoints {
  return {
    item: new CardRenderItem(CardRenderItemType.TAG, 1, {tag: tag}),
    points: points,
    target: target,
  };
}
export function oceans(points: number, target: number): CardRenderDynamicVictoryPoints {
  return {
    item: new CardRenderItem(CardRenderItemType.OCEANS, -1, {size: Size.SMALL}),
    points: points,
    target: target,
    asterisk: true,
  };
}
export function cities(points: number, target: number, any: boolean = false, asterisk: boolean = false): CardRenderDynamicVictoryPoints {
  const item = new CardRenderItem(CardRenderItemType.CITY);
  item.size = Size.SMALL;
  item.anyPlayer = any;
  return {
    item,
    points: points,
    target: target,
    asterisk: asterisk,
  };
}
export function searchForLife(): CardRenderDynamicVictoryPoints {
  return {
    item: new CardRenderItem(CardRenderItemType.RESOURCE, 1, {resource: CardResource.SCIENCE}),
    points: 3,
    target: 3,
    targetOneOrMore: true,
  };
}
export function vermin() {
  return {
    points: 0,
    target: 0,
    vermin: true,
  };
}
export function colonies(points: number, target: number, any: boolean = false): CardRenderDynamicVictoryPoints {
  const item = new CardRenderItem(CardRenderItemType.COLONIES);
  item.size = Size.SMALL;
  item.anyPlayer = any;
  return {
    item: item,
    points: points,
    target: target,
  };
}
export function moonMiningTile(points: number, any: boolean = false): CardRenderDynamicVictoryPoints {
  const item = new CardRenderItem(CardRenderItemType.MOON_MINE);
  item.size = Size.SMALL;
  item.anyPlayer = any;
  return {
    item: item,
    points: points,
    target: points,
  };
}
export function moonHabitatTile(points: number): CardRenderDynamicVictoryPoints {
  const item = new CardRenderItem(CardRenderItemType.MOON_HABITAT);
  item.size = Size.SMALL;
  return {
    item: item,
    points: points,
    target: 1,
  };
}
export function moonRoadTile(points: number, any: boolean = false): CardRenderDynamicVictoryPoints {
  const item = new CardRenderItem(CardRenderItemType.MOON_ROAD);
  item.size = Size.SMALL;
  item.anyPlayer = any;
  return {
    item: item,
    points: points,
    target: 1,
  };
}
export function cathedral(): CardRenderDynamicVictoryPoints {
  return {
    item: new CardRenderItem(CardRenderItemType.CATHEDRAL),
    points: 1,
    target: 1,
  };
}
export function questionmark(points: number = 0, per: number = 0): CardRenderDynamicVictoryPoints {
  return {
    points: points,
    target: per,
  };
}
export function any(points: number): CardRenderDynamicVictoryPoints {
  return {
    points: points,
    target: points,
    anyPlayer: true,
  };
}
export function undergroundShelters(): CardRenderDynamicVictoryPoints {
  return {
    item: new CardRenderItem(CardRenderItemType.UNDERGROUND_SHELTERS),
    points: 1,
    target: 3,
    asterisk: true,
    asFraction: true,
  };
}
