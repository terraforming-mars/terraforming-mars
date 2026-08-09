import {expect} from 'chai';
import {PartyName} from '@/common/turmoil/PartyName';
import {Resource} from '@/common/Resource';
import {Tag} from '@/common/cards/Tag';
import {normalizeRequirements} from '@/server/tools/cardDatabase/normalizeRequirements';

describe('normalizeRequirements', () => {
  it('turns a counted tag requirement into a minimum', () => {
    expect(normalizeRequirements([{tag: Tag.SCIENCE, count: 3}]))
      .deep.eq([{type: 'tag', tag: Tag.SCIENCE, min: 3}]);
  });

  it('defaults an uncounted tag requirement to one', () => {
    expect(normalizeRequirements([{tag: Tag.JOVIAN}]))
      .deep.eq([{type: 'tag', tag: Tag.JOVIAN, min: 1}]);
  });

  it('turns a global parameter requirement into a minimum', () => {
    expect(normalizeRequirements([{temperature: -6}]))
      .deep.eq([{type: 'temperature', min: -6}]);
  });

  it('turns a max requirement into a maximum', () => {
    expect(normalizeRequirements([{oxygen: 6, max: true}]))
      .deep.eq([{type: 'oxygen', max: 6}]);
  });

  it('names the resource of a production requirement', () => {
    expect(normalizeRequirements([{production: Resource.TITANIUM, count: 1}]))
      .deep.eq([{type: 'production', resource: Resource.TITANIUM, min: 1}]);
  });

  it('marks an all-player requirement', () => {
    expect(normalizeRequirements([{cities: 2, all: true}]))
      .deep.eq([{type: 'cities', min: 2, scope: 'any_player'}]);
  });

  it('carries next_to and text through', () => {
    expect(normalizeRequirements([{cities: 1, nextTo: true, text: 'next to a city'}]))
      .deep.eq([{type: 'cities', min: 1, next_to: true, text: 'next to a city'}]);
  });

  it('turns a removed plants requirement into a minimum of one', () => {
    expect(normalizeRequirements([{plantsRemoved: true}]))
      .deep.eq([{type: 'removed_plants', min: 1}]);
  });

  it('normalizes every element of a multi-requirement list', () => {
    expect(normalizeRequirements([{tag: Tag.PLANT}, {tag: Tag.ANIMAL}, {tag: Tag.MICROBE}]))
      .deep.eq([
        {type: 'tag', tag: Tag.PLANT, min: 1},
        {type: 'tag', tag: Tag.ANIMAL, min: 1},
        {type: 'tag', tag: Tag.MICROBE, min: 1},
      ]);
  });

  it('throws on a requirement it cannot express', () => {
    expect(() => normalizeRequirements([{party: PartyName.MARS}]))
      .to.throw('Unsupported requirement');
  });
});
