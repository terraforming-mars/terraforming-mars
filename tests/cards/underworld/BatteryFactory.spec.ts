import {expect} from 'chai';
import {BatteryFactory} from '../../../src/server/cards/underworld/BatteryFactory';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';

describe('BatteryFactory', () => {
  it('Should play', () => {
    const card = new BatteryFactory();
    const [/* game */, player] = testGame(2);

    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
  });

  it('canAct', () => {
    const card = new BatteryFactory();
    const [/* game */, player] = testGame(2);

    expect(card.canAct(player)).is.false;
    player.stock.energy = 1;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    const card = new BatteryFactory();
    const [game, player] = testGame(2);

    player.stock.energy = 2;
    player.tagsForTest = {power: 5};
    card.action(player);
    runAllActions(game);

    expect(player.stock.energy).eq(1);
    expect(player.stock.megacredits).eq(6); // This has a power tag too.

    player.tagsForTest = {power: 9};
    card.action(player);
    runAllActions(game);

    expect(player.stock.energy).eq(0);
    expect(player.stock.megacredits).eq(16);
  });
});
