import {expect} from 'chai';
import {testGame} from '../TestGame';
import {GainResources} from '../../src/server/inputs/GainResources';
import {TestPlayer} from '../TestPlayer';
import {Units} from '../../src/common/Units';

describe('GainResources', () => {
  let player: TestPlayer;

  beforeEach(() => {
    [/* game */, player] = testGame(1);
  });

  it('Simple', () => {
    const gainResources = new GainResources(player, 2, '');

    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);
    gainResources.process({type: 'and', responses: [
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
    ]}, player);
    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 1, plants: 1}));
  });

  it('No options', () => {
    const gainResources = new GainResources(player, 2, '');
    expect(() => gainResources.process({type: 'and', responses: []}, player)).to.throw(/Incorrect options provided/);
  });

  it('Not enough options', () => {
    const gainResources = new GainResources(player, 2, '');
    expect(() => gainResources.process({type: 'and', responses: [
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
    ]}, player)).to.throw(/Incorrect options provided/);
  });

  it('Too many options', () => {
    const gainResources = new GainResources(player, 2, '');
    expect(() => gainResources.process({type: 'and', responses: [
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
    ]}, player)).to.throw(/Incorrect options provided/);
  });

  it('Did not select enough', () => {
    const gainResources = new GainResources(player, 2, '');
    expect(() => gainResources.process({type: 'and', responses: [
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
    ]}, player)).to.throw('Select 2 resource(s)');
  });

  it('Selected too much', () => {
    const gainResources = new GainResources(player, 2, '');
    expect(() => gainResources.process({type: 'and', responses: [
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
    ]}, player)).to.throw('Select 2 resource(s)');
  });
});
