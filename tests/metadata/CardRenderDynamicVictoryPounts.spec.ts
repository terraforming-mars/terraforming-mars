import {expect} from 'chai';
import {CardRenderItem} from '../../src/cards/render/CardRenderItem';
import {CardRenderItemType} from '../../src/cards/render/CardRenderItemType';
import {CardRenderDynamicVictoryPoints} from '../../src/cards/render/CardRenderDynamicVictoryPoints';
import {ResourceType} from '../../src/ResourceType';

describe('CardRenderDynamicVictoryPoints', function() {
  describe('getPointsHtml', () => {
    it('success - returns "?"', () => {
      expect(new CardRenderDynamicVictoryPoints(undefined, 0, 0).getPointsHtml()).to.equal('?');
    });
    it('success - returns points w/o item', () => {
      expect(new CardRenderDynamicVictoryPoints(undefined, 5, 5).getPointsHtml()).to.equal('5');
    });
    it('success - returns points with item - points = targed 10/', () => {
      expect(new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.ASTEROIDS), 10, 10).getPointsHtml()).to.equal('10/');
    });
    it('success - returns points with item - points = targed 5/10', () => {
      expect(new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.ASTEROIDS), 5, 10).getPointsHtml()).to.equal('5/10');
    });
  });
  it('asteroids: success', () => {
    const vp = CardRenderDynamicVictoryPoints.asteroids(5, 10);
    const item = vp.item as CardRenderItem;
    expect(vp.getPointsHtml()).to.equal('5/10');
    expect(item.type).to.equal(CardRenderItemType.ASTEROIDS);
  });
  it('microbes: success', () => {
    const vp = CardRenderDynamicVictoryPoints.resource(ResourceType.MICROBE, 1, 3);
    const item = vp.item as CardRenderItem;
    expect(vp.getPointsHtml()).to.equal('1/3');
    expect(item.type).to.equal(CardRenderItemType.MICROBES);
  });
  it('animals: success', () => {
    const vp = CardRenderDynamicVictoryPoints.resource(ResourceType.ANIMAL, 1, 1);
    const item = vp.item as CardRenderItem;
    expect(vp.getPointsHtml()).to.equal('1/');
    expect(item.type).to.equal(CardRenderItemType.ANIMALS);
  });
  it('oceans: success', () => {
    const vp = CardRenderDynamicVictoryPoints.oceans(1, 1);
    const item = vp.item as CardRenderItem;
    expect(vp.getPointsHtml()).to.equal('1/');
    expect(item.type).to.equal(CardRenderItemType.OCEANS);
  });
  it('cities: success', () => {
    const vp = CardRenderDynamicVictoryPoints.cities(1, 3);
    const item = vp.item as CardRenderItem;
    expect(vp.getPointsHtml()).to.equal('1/3');
    expect(item.type).to.equal(CardRenderItemType.CITY);
  });
  it('cities: success + any', () => {
    const vp = CardRenderDynamicVictoryPoints.cities(1, 3, true);
    const item = vp.item as CardRenderItem;
    expect(vp.getPointsHtml()).to.equal('1/3');
    expect(item.type).to.equal(CardRenderItemType.CITY);
    expect(item.anyPlayer).to.be.true;
  });
  it('floaters: success', () => {
    const vp = CardRenderDynamicVictoryPoints.resource(ResourceType.FLOATER, 1, 2);
    const item = vp.item as CardRenderItem;
    expect(vp.getPointsHtml()).to.equal('1/2');
    expect(item.type).to.equal(CardRenderItemType.FLOATERS);
  });
  it('search for life: success', () => {
    const vp = CardRenderDynamicVictoryPoints.searchForLife();
    const item = vp.item as CardRenderItem;
    expect(vp.points).to.equal(3);
    expect(vp.target).to.equal(3);
    expect(vp.targetOneOrMore).to.be.true;
    expect(item.type).to.equal(CardRenderItemType.SCIENCE);
  });
  it('fighter: success', () => {
    const vp = CardRenderDynamicVictoryPoints.resource(ResourceType.FIGHTER, 1, 1);
    const item = vp.item as CardRenderItem;
    expect(vp.getPointsHtml()).to.equal('1/');
    expect(item.type).to.equal(CardRenderItemType.FIGHTER);
  });
  it('camps: success', () => {
    const vp = CardRenderDynamicVictoryPoints.resource(ResourceType.CAMP, 1, 1);
    const item = vp.item as CardRenderItem;
    expect(vp.getPointsHtml()).to.equal('1/');
    expect(item.type).to.equal(CardRenderItemType.CAMPS);
  });
  it('colonies: success', () => {
    const vp = CardRenderDynamicVictoryPoints.colonies(1, 2, true);
    const item = vp.item as CardRenderItem;
    expect(vp.getPointsHtml()).to.equal('1/2');
    expect(item.anyPlayer).to.be.true;
    expect(item.type).to.equal(CardRenderItemType.COLONIES);
  });
  it('questionmark: success', () => {
    const vp = CardRenderDynamicVictoryPoints.questionmark();
    expect(vp.getPointsHtml()).to.equal('?');
  });
  it('any: success', () => {
    const vp = CardRenderDynamicVictoryPoints.any(1);
    expect(vp.anyPlayer).to.be.true;
  });
});
