import {expect} from 'chai';
import {testGame} from '../TestGame';
import {SelectResources} from '../../src/server/inputs/SelectResources';
import {TestPlayer} from '../TestPlayer';
import {Units} from '../../src/common/Units';

describe('SelectResources', function() {
  let player: TestPlayer;

  beforeEach(() => {
    [/* game */, player] = testGame(1);
  });

  it('Simple', function() {
    const selectResources = new SelectResources(player, 2, '');

    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);
    selectResources.process({type: 'and', responses: [
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
    ]}, player);
    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 1, plants: 1}));
  });

  it('No options', function() {
    const selectResources = new SelectResources(player, 2, '');
    expect(() => selectResources.process({type: 'and', responses: []}, player)).to.throw(/Incorrect options provided/);
  });

  it('Not enough options', function() {
    const selectResources = new SelectResources(player, 2, '');
    expect(() => selectResources.process({type: 'and', responses: [
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
    ]}, player)).to.throw(/Incorrect options provided/);
  });

  it('Too many options', function() {
    const selectResources = new SelectResources(player, 2, '');
    expect(() => selectResources.process({type: 'and', responses: [
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
    ]}, player)).to.throw(/Incorrect options provided/);
  });

  it('Did not select enough', function() {
    const selectResources = new SelectResources(player, 2, '');
    expect(() => selectResources.process({type: 'and', responses: [
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
    ]}, player)).to.throw(/Select 2 resources/);
  });

  it('Selected too much', function() {
    const selectResources = new SelectResources(player, 2, '');
    expect(() => selectResources.process({type: 'and', responses: [
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 1},
      {type: 'amount', amount: 0},
      {type: 'amount', amount: 0},
    ]}, player)).to.throw(/Select 2 resources/);
  });
});
