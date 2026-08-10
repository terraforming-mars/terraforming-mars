import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {Tag} from '@/common/cards/Tag';
import {CardEntry} from '@/server/tools/cardDatabase/CardDatabaseTypes';
import {buildCardDatabase, buildIndex} from '@/server/tools/cardDatabase/buildCardDatabase';
import {CARD_OVERLAY} from '@/server/tools/cardDatabase/overlay';

describe('buildCardDatabase', () => {
  const entries = buildCardDatabase();
  const byName = new Map<string, CardEntry>(entries.map((entry) => [entry.name, entry]));

  function get(name: CardName): CardEntry {
    const entry = byName.get(name);
    if (entry === undefined) {
      throw new Error('Not in the database: ' + name);
    }
    return entry;
  }

  it('covers only the base, corpera and prelude sets', () => {
    const sets = new Set(entries.map((entry) => entry.set));
    expect([...sets].sort()).deep.eq(['base', 'corpera', 'prelude']);
  });

  it('gives every card a unique id', () => {
    const ids = entries.map((entry) => entry.id);
    expect(new Set(ids).size).eq(ids.length);
  });

  it('is sorted by set then id', () => {
    const order = ['base', 'corpera', 'prelude'];
    const keys = entries.map((entry) => `${order.indexOf(entry.set)}:${entry.id}`);
    expect(keys).deep.eq([...keys].sort());
  });

  it('describes a declarative automated card', () => {
    expect(get(CardName.ALGAE)).deep.eq({
      id: 'algae',
      name: CardName.ALGAE,
      set: 'base',
      kind: 'project',
      type: CardType.AUTOMATED,
      card_number: '047',
      description: 'Requires 5 ocean tiles. Gain 1 plant and increase your plant production 2 steps.',
      cost: 10,
      tags: [Tag.PLANT],
      requirements: [{type: 'oceans', min: 5}],
      immediate: {production: {plants: 2}, gain: {plants: 1}},
      bespoke: false,
    });
  });

  it('describes an active card with a declarative action', () => {
    const aiCentral = get(CardName.AI_CENTRAL);
    expect(aiCentral.type).eq(CardType.ACTIVE);
    expect(aiCentral.cost).eq(21);
    expect(aiCentral.vp).eq(1);
    expect(aiCentral.requirements).deep.eq([{type: 'tag', tag: Tag.SCIENCE, min: 3}]);
    expect(aiCentral.immediate).deep.eq({production: {energy: -1}});
    expect(aiCentral.action).deep.eq({draw: {count: 2}});
    expect(aiCentral.bespoke).is.false;
  });

  it('records a corporation starting M€ and omits its cost', () => {
    const teractor = get(CardName.TERACTOR);
    expect(teractor.kind).eq('corporation');
    expect(teractor.set).eq('corpera');
    expect(teractor.cost).eq(undefined);
    expect(teractor.starting_megacredits).eq(60);
    expect(teractor.card_discount).deep.eq([{tag: Tag.EARTH, amount: 3}]);
  });

  it('records a corporation first action', () => {
    const inventrix = get(CardName.INVENTRIX);
    expect(inventrix.first_action).deep.eq({text: 'Draw 3 cards', draw: {count: 3}});
    expect(inventrix.global_parameter_requirement_bonus).deep.eq({steps: 2});
  });

  it('records a prelude cost as a negative starting M€', () => {
    const hugeAsteroid = get(CardName.HUGE_ASTEROID);
    expect(hugeAsteroid.kind).eq('prelude');
    expect(hugeAsteroid.set).eq('prelude');
    expect(hugeAsteroid.starting_megacredits).eq(-5);
    expect(hugeAsteroid.immediate).deep.eq({global: {temperature: 3}});
  });

  it('records dynamic victory points', () => {
    expect(get(CardName.ANTS).vp_dynamic).deep.eq({counts: 'resources_here', per: 2});
  });

  it('records special victory points', () => {
    const searchForLife = get(CardName.SEARCH_FOR_LIFE);
    expect(searchForLife.vp_special).is.true;
    expect(searchForLife.vp).eq(undefined);
  });

  it('flags cards whose behavior is not fully declarative', () => {
    expect(get(CardName.ROBOTIC_WORKFORCE).bespoke).is.true;
    expect(get(CardName.HELION).bespoke).is.true;
    expect(get(CardName.ALGAE).bespoke).is.false;
  });

  it('documents every card whose behavior is not fully declarative', () => {
    const undocumented = entries
      .filter((entry) => entry.bespoke && entry.semantics === undefined && entry.passive === undefined)
      .map((entry) => `${entry.set}/${entry.name}`);
    expect(undocumented, 'cards missing an entry in CARD_OVERLAY').deep.eq([]);
  });

  it('has no overlay entry for a card that does not need one', () => {
    const documented = new Set(Object.keys(CARD_OVERLAY));
    const unnecessary = entries
      .filter((entry) => !entry.bespoke && documented.has(entry.name) && entry.semantics !== undefined)
      .map((entry) => entry.name);
    expect(unnecessary, 'overlay entries for cards that no longer need one').deep.eq([]);
  });

  it('applies corporation semantics', () => {
    const helion = get(CardName.HELION);
    expect(helion.semantics).contains('heat may be spent as if it were M€');
    expect(helion.passive).deep.eq([{
      trigger: 'you pay for anything',
      effect: 'you may substitute heat for M€ one for one',
    }]);
  });
});

describe('buildIndex', () => {
  it('reduces each entry to its lookup fields', () => {
    const index = buildIndex(buildCardDatabase());
    const algae = index.find((entry) => entry.id === 'algae');
    expect(algae).deep.eq({
      id: 'algae',
      name: CardName.ALGAE,
      set: 'base',
      kind: 'project',
      type: CardType.AUTOMATED,
      cost: 10,
      tags: [Tag.PLANT],
      bespoke: false,
    });
  });
});
