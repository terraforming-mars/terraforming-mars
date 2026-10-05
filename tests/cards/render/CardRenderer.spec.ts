import {expect} from 'chai';
import {CardRenderer} from '../../../src/server/cards/render/CardRenderer';
import {CardRenderItem} from '../../../src/server/cards/render/CardRenderItem';
import {CardRenderItemType} from '../../../src/common/cards/render/CardRenderItemType';
import {Size} from '../../../src/common/cards/render/Size';
import {AltSecondaryTag} from '../../../src/common/cards/render/AltSecondaryTag';
import {CardResource} from '../../../src/common/CardResource';
import {Tag} from '../../../src/common/cards/Tag';
import {cast} from '../../../src/common/utils/utils';
import {CardRenderSymbol} from '../../../src/server/cards/render/CardRenderSymbol';

describe('CardRenderer', () => {
  describe('temperature', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.temperature(1));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.TEMPERATURE);
      expect(item.amount).to.equal(1);
    });
  });
  describe('oceans', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.oceans(1));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.OCEANS);
      expect(item.amount).to.equal(1);
    });
  });
  describe('oxygen', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.oxygen(3));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.OXYGEN);
      expect(item.amount).to.equal(3);
    });
  });
  describe('venus', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.venus(18));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.VENUS);
      expect(item.amount).to.equal(18);
    });
  });
  it('plants: success', () => {
    const renderer = CardRenderer.builder((b) => b.plants(5));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.PLANTS);
    expect(item.amount).to.equal(5);
  });
  it('heat: success', () => {
    const renderer = CardRenderer.builder((b) => b.heat(2));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.HEAT);
    expect(item.amount).to.equal(2);
  });
  it('energy: success', () => {
    const renderer = CardRenderer.builder((b) => b.energy(3));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.ENERGY);
    expect(item.amount).to.equal(3);
  });
  describe('titanium', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.titanium(3));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.TITANIUM);
      expect(item.amount).to.equal(3);
    });
  });
  it('steel: success', () => {
    const renderer = CardRenderer.builder((b) => b.steel(2));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.STEEL);
    expect(item.amount).to.equal(2);
  });
  describe('tr', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.tr(10));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.TR);
      expect(item.amount).to.equal(10);
    });
    it('size - S', () => {
      const renderer = CardRenderer.builder((b) => b.tr(6, {size: Size.SMALL}));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.amount).to.equal(6);
      expect(item.size).to.equal(Size.SMALL);
      expect(item.cancelled).to.be.undefined;
    });
    it('cancelled', () => {
      const renderer = CardRenderer.builder((b) => b.tr(6, {size: Size.SMALL, cancelled: true}));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.amount).to.equal(6);
      expect(item.size).to.equal(Size.SMALL);
      expect(item.cancelled).to.be.true;
    });
  });
  describe('megacredits', () => {
    it('success - amount inside (always)', () => {
      const renderer = CardRenderer.builder((b) => b.megacredits(45));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.MEGACREDITS);
      expect(item.amount).to.equal(45);
      expect(item.showDigit).to.be.undefined;
      expect(item.amountInside).to.be.true;
    });
    it('size - s', () => {
      const renderer = CardRenderer.builder((b) => b.megacredits(16, {size: Size.SMALL}));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.MEGACREDITS);
      expect(item.amount).to.equal(16);
      expect(item.showDigit).to.be.undefined;
      expect(item.amountInside).to.be.true;
      expect(item.size).to.equal(Size.SMALL);
    });
  });
  it('cards: success', () => {
    const renderer = CardRenderer.builder((b) => b.cards(3));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.CARDS);
    expect(item.amount).to.equal(3);
  });
  it('event: success', () => {
    const renderer = CardRenderer.builder((b) => b.tag(Tag.EVENT));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TAG);
    expect(item.tag).to.equal(Tag.EVENT);
    expect(item.amount).is.undefined;
  });
  it('space: success', () => {
    const renderer = CardRenderer.builder((b) => b.tag(Tag.SPACE));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TAG);
    expect(item.tag).to.equal(Tag.SPACE);
    expect(item.amount).is.undefined;
  });
  it('earth: success', () => {
    const renderer = CardRenderer.builder((b) => b.tag(Tag.EARTH));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TAG);
    expect(item.tag).to.equal(Tag.EARTH);
    expect(item.amount).is.undefined;
  });
  it('building: success', () => {
    const renderer = CardRenderer.builder((b) => b.tag(Tag.BUILDING, 2));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TAG);
    expect(item.tag).to.equal(Tag.BUILDING);
    expect(item.amount).to.equal(2);
  });
  it('jovian: success', () => {
    const renderer = CardRenderer.builder((b) => b.tag(Tag.JOVIAN));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TAG);
    expect(item.tag).to.equal(Tag.JOVIAN);
    expect(item.amount).is.undefined;
  });
  it('science: success', () => {
    const renderer = CardRenderer.builder((b) => b.resource(CardResource.SCIENCE, 3));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.RESOURCE);
    expect(item.resource).to.equal(CardResource.SCIENCE);
    expect(item.amount).to.equal(3);
  });
  it('trade: success', () => {
    const renderer = CardRenderer.builder((b) => b.trade());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TRADE);
    expect(item.amount).is.undefined;
  });
  it('tradeFleet: success', () => {
    const renderer = CardRenderer.builder((b) => b.tradeFleet());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TRADE_FLEET);
    expect(item.amount).is.undefined;
  });
  describe('colonies', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.colonies(2));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.COLONIES);
      expect(item.amount).to.equal(2);
    });
    it('size - s', () => {
      const renderer = CardRenderer.builder((b) => b.colonies(1, {size: Size.SMALL}));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.COLONIES);
      expect(item.size).to.equal(Size.SMALL);
      expect(item.amount).to.equal(1);
    });
  });
  it('tradeDiscount: success', () => {
    const renderer = CardRenderer.builder((b) => b.tradeDiscount(2));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TRADE_DISCOUNT);
    expect(item.amount).to.equal(-2);
  });
  it('colonyTile: success', () => {
    const renderer = CardRenderer.builder((b) => b.colonyTile());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.COLONY_TILE);
    expect(item.amount).is.undefined;
  });
  it('influence: success', () => {
    const renderer = CardRenderer.builder((b) => b.influence());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.INFLUENCE);
    expect(item.amount).to.equal(1);
  });
  it('city: success', () => {
    const renderer = CardRenderer.builder((b) => b.city());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.CITY);
    expect(item.amount).is.undefined;
  });
  describe('greenery', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.greenery());
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.GREENERY);
      expect(item.amount).is.undefined;
    });
    it('size - s', () => {
      const renderer = CardRenderer.builder((b) => b.greenery({size: Size.SMALL}));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.GREENERY);
      expect(item.size).to.equal(Size.SMALL);
      expect(item.amount).is.undefined;
    });
    it('without 02', () => {
      const renderer = CardRenderer.builder((b) => b.greenery());
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.GREENERY);
      expect(item.secondaryTag).to.equal(AltSecondaryTag.OXYGEN);
      expect(item.amount).is.undefined;
    });
  });
  it('delegates: success', () => {
    const renderer = CardRenderer.builder((b) => b.delegates(2));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.DELEGATES);
    expect(item.amount).to.equal(2);
  });
  it('partyLeaders: success', () => {
    const renderer = CardRenderer.builder((b) => b.partyLeaders(1));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.PARTY_LEADERS);
    expect(item.amount).to.equal(1);
  });
  it('chairman: success', () => {
    const renderer = CardRenderer.builder((b) => b.chairman());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.CHAIRMAN);
    expect(item.amount).is.undefined;
  });
  it('wild: success', () => {
    const renderer = CardRenderer.builder((b) => b.wild(2));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.WILD);
    expect(item.amount).to.equal(2);
  });
  it('preservation: success', () => {
    const renderer = CardRenderer.builder((b) => b.resource(CardResource.PRESERVATION));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.RESOURCE);
    expect(item.resource).to.equal(CardResource.PRESERVATION);
    expect(item.amount).is.undefined;
  });
  it('diverseTag: success', () => {
    const renderer = CardRenderer.builder((b) => b.diverseTag());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.DIVERSE_TAG);
    expect(item.amount).to.equal(1);
  });
  it('camps: success', () => {
    const renderer = CardRenderer.builder((b) => b.resource(CardResource.CAMP));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.RESOURCE);
    expect(item.resource).to.equal(CardResource.CAMP);
    expect(item.amount).is.undefined;
  });
  it('selfReplicatingRobots: success', () => {
    const renderer = CardRenderer.builder((b) => b.selfReplicatingRobots());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.SELF_REPLICATING);
    expect(item.amount).is.undefined;
  });
  it('prelude: success', () => {
    const renderer = CardRenderer.builder((b) => b.prelude());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.PRELUDE);
    expect(item.amount).is.undefined;
  });
  it('corporation: success', () => {
    const renderer = CardRenderer.builder((b) => b.corporation());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.CORPORATION);
    expect(item.amount).is.undefined;
  });
  it('award: success', () => {
    const renderer = CardRenderer.builder((b) => b.award());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.AWARD);
    expect(item.amount).is.undefined;
  });
  it('vpIcon: success', () => {
    const renderer = CardRenderer.builder((b) => b.vpIcon());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.VP);
    expect(item.amount).is.undefined;
  });
  it('community: success', () => {
    const renderer = CardRenderer.builder((b) => b.community());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.COMMUNITY);
    expect(item.amount).is.undefined;
  });
  it('disease: success', () => {
    const renderer = CardRenderer.builder((b) => b.resource(CardResource.DISEASE));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.RESOURCE);
    expect(item.resource).to.equal(CardResource.DISEASE);
    expect(item.amount).is.undefined;
  });
  it('multiplierWhite: success', () => {
    const renderer = CardRenderer.builder((b) => b.multiplierWhite());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.MULTIPLIER_WHITE);
    expect(item.amount).is.undefined;
  });
  it('negative digit: prefixed with minus', () => {
    const renderer = CardRenderer.builder((b) => b.plants(-3, {digit: true}).steel(-3, {digit: true}));
    const row = renderer.rows[0];
    expect(row).has.length(4);
    expect(row[0]).deep.eq(CardRenderSymbol.minus(Size.MEDIUM));
    expect(cast(row[1], CardRenderItem).amount).eq(3);
    expect(row[2]).deep.eq(CardRenderSymbol.minus(Size.MEDIUM));
    expect(cast(row[3], CardRenderItem).amount).eq(3);
  });
  it('negative without digit: prefixed with minus', () => {
    const renderer = CardRenderer.builder((b) => b.plants(-3));
    const row = renderer.rows[0];
    expect(row).has.length(2);
    expect(row[0]).deep.eq(CardRenderSymbol.minus(Size.MEDIUM));
    expect(cast(row[1], CardRenderItem).amount).eq(3);
  });
  it('no amount: no minus', () => {
    const renderer = CardRenderer.builder((b) => b.tag(Tag.EARTH));
    const row = renderer.rows[0];
    expect(row).has.length(1);
    expect(cast(row[0], CardRenderItem).amount).is.undefined;
  });
  it('negative megacredits: no minus', () => {
    const renderer = CardRenderer.builder((b) => b.megacredits(-6));
    const row = renderer.rows[0];
    expect(row).has.length(1);
    expect(cast(row[0], CardRenderItem).amount).eq(-6);
  });
  it('negative digit: explicit minus throws', () => {
    expect(() => CardRenderer.builder((b) => b.minus().plants(-1))).to.throw(/already has a minus symbol/);
  });
});
