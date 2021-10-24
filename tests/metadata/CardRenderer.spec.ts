import {CardRenderer} from '../../src/cards/render/CardRenderer';
import {CardRenderItem, AltSecondaryTag} from '../../src/cards/render/CardRenderItem';
import {CardRenderItemType} from '../../src/cards/render/CardRenderItemType';
import {Size} from '../../src/cards/render/Size';
import {expect} from 'chai';

describe('CardRenderer', function() {
  describe('temperature', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.temperature(1));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.TEMPERATURE);
      expect(item.amount).to.equal(1);
    });
  });
  describe('oceans', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.oceans(1));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.OCEANS);
      expect(item.amount).to.equal(1);
    });
  });
  describe('oxygen', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.oxygen(3));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.OXYGEN);
      expect(item.amount).to.equal(3);
    });
  });
  describe('venus', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.venus(18));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.VENUS);
      expect(item.amount).to.equal(18);
    });
  });
  it('plants: success', () => {
    const renderer = CardRenderer.builder((b) => b.plants(-5));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.PLANTS);
    expect(item.amount).to.equal(-5);
  });
  it('microbes: success', () => {
    const renderer = CardRenderer.builder((b) => b.microbes(2));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.MICROBES);
    expect(item.amount).to.equal(2);
  });
  it('animals: success', () => {
    const renderer = CardRenderer.builder((b) => b.animals(2));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.ANIMALS);
    expect(item.amount).to.equal(2);
  });
  it('heat: success', () => {
    const renderer = CardRenderer.builder((b) => b.heat(2));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.HEAT);
    expect(item.amount).to.equal(2);
  });
  it('energy: success', () => {
    const renderer = CardRenderer.builder((b) => b.energy(3));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.ENERGY);
    expect(item.amount).to.equal(3);
  });
  describe('titanium', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.titanium(3));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.TITANIUM);
      expect(item.amount).to.equal(3);
    });
    it('shows digit for amount > 5', () => {
      const renderer = CardRenderer.builder((b) => b.titanium(6, {digit: 'large'}));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.TITANIUM);
      expect(item.showDigit).to.be.true;
      expect(item.amount).to.equal(6);
    });
  });
  it('steel: success', () => {
    const renderer = CardRenderer.builder((b) => b.steel(2));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.STEEL);
    expect(item.amount).to.equal(2);
  });
  describe('tr', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.tr(10));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.TR);
      expect(item.amount).to.equal(10);
    });
    it('size - S', () => {
      const renderer = CardRenderer.builder((b) => b.tr(6, {size: Size.SMALL}));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.amount).to.equal(6);
      expect(item.size).to.equal(Size.SMALL);
      expect(item.cancelled).to.be.false;
    });
    it('cancelled', () => {
      const renderer = CardRenderer.builder((b) => b.tr(6, {size: Size.SMALL, cancelled: true}));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.amount).to.equal(6);
      expect(item.size).to.equal(Size.SMALL);
      expect(item.cancelled).to.be.true;
    });
  });
  describe('megacredits', () => {
    it('success - amount inside (always)', () => {
      const renderer = CardRenderer.builder((b) => b.megacredits(45));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.MEGACREDITS);
      expect(item.amount).to.equal(45);
      expect(item.showDigit).to.be.false;
      expect(item.amountInside).to.be.true;
    });
    it('size - s', () => {
      const renderer = CardRenderer.builder((b) => b.megacredits(16, {size: Size.SMALL}));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.MEGACREDITS);
      expect(item.amount).to.equal(16);
      expect(item.showDigit).to.be.false;
      expect(item.amountInside).to.be.true;
      expect(item.size).to.equal(Size.SMALL);
    });
  });
  it('cards: success', () => {
    const renderer = CardRenderer.builder((b) => b.cards(3));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.CARDS);
    expect(item.amount).to.equal(3);
  });
  it('floaters: success', () => {
    const renderer = CardRenderer.builder((b) => b.floaters(3));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.FLOATERS);
    expect(item.amount).to.equal(3);
  });
  it('asteroids: success', () => {
    const renderer = CardRenderer.builder((b) => b.asteroids(1));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.ASTEROIDS);
    expect(item.amount).to.equal(1);
  });
  it('event: success', () => {
    const renderer = CardRenderer.builder((b) => b.event());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.EVENT);
    expect(item.amount).to.equal(-1);
  });
  it('space: success', () => {
    const renderer = CardRenderer.builder((b) => b.space());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.SPACE);
    expect(item.amount).to.equal(-1);
  });
  it('earth: success', () => {
    const renderer = CardRenderer.builder((b) => b.earth(1));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.EARTH);
    expect(item.amount).to.equal(1);
  });
  it('building: success', () => {
    const renderer = CardRenderer.builder((b) => b.building(2));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.BUILDING);
    expect(item.amount).to.equal(2);
  });
  it('jovian: success', () => {
    const renderer = CardRenderer.builder((b) => b.jovian());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.JOVIAN);
    expect(item.amount).to.equal(-1);
  });
  it('science: success', () => {
    const renderer = CardRenderer.builder((b) => b.science(3));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.SCIENCE);
    expect(item.amount).to.equal(3);
  });
  it('trade: success', () => {
    const renderer = CardRenderer.builder((b) => b.trade());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.TRADE);
    expect(item.amount).to.equal(-1);
  });
  it('tradeFleet: success', () => {
    const renderer = CardRenderer.builder((b) => b.tradeFleet());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.TRADE_FLEET);
    expect(item.amount).to.equal(-1);
  });
  describe('colonies', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.colonies(2));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.COLONIES);
      expect(item.amount).to.equal(2);
    });
    it('size - s', () => {
      const renderer = CardRenderer.builder((b) => b.colonies(1, {size: Size.SMALL}));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.COLONIES);
      expect(item.size).to.equal(Size.SMALL);
      expect(item.amount).to.equal(1);
    });
  });
  it('tradeDiscount: success', () => {
    const renderer = CardRenderer.builder((b) => b.tradeDiscount(2));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.TRADE_DISCOUNT);
    expect(item.amount).to.equal(-2);
  });
  it('placeColony: success', () => {
    const renderer = CardRenderer.builder((b) => b.placeColony());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.PLACE_COLONY);
    expect(item.amount).to.equal(-1);
  });
  it('influence: success', () => {
    const renderer = CardRenderer.builder((b) => b.influence());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.INFLUENCE);
    expect(item.amount).to.equal(1);
  });
  it('city: success', () => {
    const renderer = CardRenderer.builder((b) => b.city());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.CITY);
    expect(item.amount).to.equal(-1);
  });
  describe('greenery', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.greenery());
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.GREENERY);
      expect(item.amount).to.equal(-1);
    });
    it('size - s', () => {
      const renderer = CardRenderer.builder((b) => b.greenery(Size.SMALL));
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.GREENERY);
      expect(item.size).to.equal(Size.SMALL);
      expect(item.amount).to.equal(-1);
    });
    it('without 02', () => {
      const renderer = CardRenderer.builder((b) => b.greenery());
      const item = renderer.rows[0][0] as CardRenderItem;
      expect(item.type).to.equal(CardRenderItemType.GREENERY);
      expect(item.secondaryTag).to.equal(AltSecondaryTag.OXYGEN);
      expect(item.amount).to.equal(-1);
    });
  });
  it('delegates: success', () => {
    const renderer = CardRenderer.builder((b) => b.delegates(2));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.DELEGATES);
    expect(item.amount).to.equal(2);
  });
  it('partyLeaders: success', () => {
    const renderer = CardRenderer.builder((b) => b.partyLeaders(1));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.PARTY_LEADERS);
    expect(item.amount).to.equal(1);
  });
  it('chairman: success', () => {
    const renderer = CardRenderer.builder((b) => b.chairman());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.CHAIRMAN);
    expect(item.amount).to.equal(-1);
  });
  it('wild: success', () => {
    const renderer = CardRenderer.builder((b) => b.wild(2));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.WILD);
    expect(item.amount).to.equal(2);
  });
  it('preservation: success', () => {
    const renderer = CardRenderer.builder((b) => b.preservation(1));
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.PRESERVATION);
    expect(item.amount).to.equal(1);
  });
  it('diverseTag: success', () => {
    const renderer = CardRenderer.builder((b) => b.diverseTag());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.DIVERSE_TAG);
    expect(item.amount).to.equal(1);
  });
  it('fighter: success', () => {
    const renderer = CardRenderer.builder((b) => b.fighter());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.FIGHTER);
    expect(item.amount).to.equal(1);
  });
  it('camps: success', () => {
    const renderer = CardRenderer.builder((b) => b.camps());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.CAMPS);
    expect(item.amount).to.equal(1);
  });
  it('selfReplicatingRobots: success', () => {
    const renderer = CardRenderer.builder((b) => b.selfReplicatingRobots());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.SELF_REPLICATING);
    expect(item.amount).to.equal(-1);
  });
  it('prelude: success', () => {
    const renderer = CardRenderer.builder((b) => b.prelude());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.PRELUDE);
    expect(item.amount).to.equal(-1);
  });
  it('award: success', () => {
    const renderer = CardRenderer.builder((b) => b.award());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.AWARD);
    expect(item.amount).to.equal(-1);
  });
  it('vpIcon: success', () => {
    const renderer = CardRenderer.builder((b) => b.vpIcon());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.VP);
    expect(item.amount).to.equal(-1);
  });
  it('community: success', () => {
    const renderer = CardRenderer.builder((b) => b.community());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.COMMUNITY);
    expect(item.amount).to.equal(-1);
  });
  it('disease: success', () => {
    const renderer = CardRenderer.builder((b) => b.disease());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.DISEASE);
    expect(item.amount).to.equal(-1);
  });
  it('multiplierWhite: success', () => {
    const renderer = CardRenderer.builder((b) => b.multiplierWhite());
    const item = renderer.rows[0][0] as CardRenderItem;
    expect(item.type).to.equal(CardRenderItemType.MULTIPLIER_WHITE);
    expect(item.amount).to.equal(-1);
  });
});
