import {expect} from 'chai';
import {CardResource} from '@/common/CardResource';
import {Resource} from '@/common/Resource';
import {Tag} from '@/common/cards/Tag';
import {TileType} from '@/common/TileType';
import {normalizeDynamic, normalizeEffect, normalizeVictoryPoints} from '@/server/tools/cardDatabase/normalizeEffect';

describe('normalizeEffect', () => {
  it('returns undefined for no behavior', () => {
    expect(normalizeEffect(undefined)).eq(undefined);
    expect(normalizeEffect({})).eq(undefined);
  });

  it('splits production from stock gains', () => {
    expect(normalizeEffect({production: {plants: 2}, stock: {plants: 1}}))
      .deep.eq({production: {plants: 2}, gain: {plants: 1}});
  });

  it('keeps negative production', () => {
    expect(normalizeEffect({production: {energy: -1, megacredits: 2}}))
      .deep.eq({production: {energy: -1, megacredits: 2}});
  });

  it('turns a numeric card draw into a draw count', () => {
    expect(normalizeEffect({drawCard: 2})).deep.eq({draw: {count: 2}});
  });

  it('carries card draw qualifiers through', () => {
    expect(normalizeEffect({drawCard: {count: 4, keep: 1, tag: Tag.MICROBE}}))
      .deep.eq({draw: {count: 4, keep: 1, tag: Tag.MICROBE}});
  });

  it('records terraform rating under gain', () => {
    expect(normalizeEffect({tr: 2, global: {temperature: 1}}))
      .deep.eq({gain: {tr: 2}, global: {temperature: 1}});
  });

  it('records resources added to this card under gain', () => {
    expect(normalizeEffect({addResources: 1})).deep.eq({gain: {resources_here: 1}});
  });

  it('lists an ocean placement', () => {
    expect(normalizeEffect({ocean: {}})).deep.eq({place: [{tile: 'ocean'}]});
  });

  it('carries a placement restriction through', () => {
    expect(normalizeEffect({ocean: {on: 'land'}})).deep.eq({place: [{tile: 'ocean', on: 'land'}]});
  });

  it('lists ocean, city, greenery and special tiles in that order', () => {
    expect(normalizeEffect({
      greenery: {},
      city: {},
      ocean: {},
      tile: {type: TileType.INDUSTRIAL_CENTER, on: 'land', title: 'Select space adjacent to a city tile'},
    })).deep.eq({
      place: [
        {tile: 'ocean'},
        {tile: 'city'},
        {tile: 'greenery'},
        {tile: TileType.INDUSTRIAL_CENTER, on: 'land', title: 'Select space adjacent to a city tile'},
      ],
    });
  });

  it('describes a spend', () => {
    expect(normalizeEffect({spend: {energy: 1}, drawCard: 1}))
      .deep.eq({spend: {energy: 1}, draw: {count: 1}});
  });

  it('lists the resources a spend may be paid with', () => {
    expect(normalizeEffect({spend: {megacredits: 8, canUseSteel: true}, global: {temperature: 1}}))
      .deep.eq({spend: {megacredits: 8, can_pay_with: ['steel']}, global: {temperature: 1}});
  });

  it('describes production removal from any player', () => {
    expect(normalizeEffect({decreaseAnyProduction: {type: Resource.PLANTS, count: 1}}))
      .deep.eq({decrease_any_production: {resource: Resource.PLANTS, count: 1}});
  });

  it('normalizes resources added to other cards to a list', () => {
    expect(normalizeEffect({addResourcesToAnyCard: {count: 2, type: CardResource.MICROBE, mustHaveCard: true}}))
      .deep.eq({add_resources_to_any_card: [{count: 2, resource: CardResource.MICROBE, must_have_card: true}]});
  });

  it('corrects the misspelled titanium value key', () => {
    expect(normalizeEffect({titanumValue: 1, steelValue: 1}))
      .deep.eq({titanium_value: 1, steel_value: 1});
  });

  it('flattens an or-behavior into titled alternatives', () => {
    expect(normalizeEffect({
      or: {
        behaviors: [
          {title: 'Gain 4 plants', stock: {plants: 4}},
          {title: 'Gain 2 titanium', stock: {titanium: 2}},
        ],
      },
    })).deep.eq({
      or: [
        {title: 'Gain 4 plants', gain: {plants: 4}},
        {title: 'Gain 2 titanium', gain: {titanium: 2}},
      ],
    });
  });

  it('drops log directives', () => {
    expect(normalizeEffect({log: '${player} did a thing'})).eq(undefined);
  });

  it('throws on a stanza from an out-of-scope module', () => {
    expect(() => normalizeEffect({moon: {miningRate: 1}})).to.throw('Unsupported behavior');
    expect(() => normalizeEffect({underworld: {excavate: 1}})).to.throw('Unsupported behavior');
  });

  it('expresses a state-dependent amount as a dynamic', () => {
    expect(normalizeEffect({stock: {megacredits: {tag: Tag.EARTH}}}))
      .deep.eq({gain: {megacredits: {dynamic: {counts: 'tag', tag: Tag.EARTH}}}});
  });
});

describe('normalizeDynamic', () => {
  it('counts tags', () => {
    expect(normalizeDynamic({tag: Tag.JOVIAN})).deep.eq({counts: 'tag', tag: Tag.JOVIAN});
  });

  it('counts cities across the board', () => {
    expect(normalizeDynamic({cities: {}, all: true})).deep.eq({counts: 'cities', scope: 'everyone'});
  });

  it('counts opponents tags', () => {
    expect(normalizeDynamic({tag: Tag.SPACE, others: true})).deep.eq({counts: 'tag', tag: Tag.SPACE, scope: 'opponents'});
  });

  it('carries multipliers and divisors', () => {
    expect(normalizeDynamic({tag: Tag.MOON, each: 2, per: 3}))
      .deep.eq({counts: 'tag', tag: Tag.MOON, each: 2, per: 3});
  });
});

describe('normalizeVictoryPoints', () => {
  it('counts resources on this card', () => {
    expect(normalizeVictoryPoints({resourcesHere: {}, per: 2}))
      .deep.eq({counts: 'resources_here', per: 2});
  });
});
