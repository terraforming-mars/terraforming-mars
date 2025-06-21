import {expect} from 'chai';
import {Biobatteries} from '../../../src/server/cards/underworld/Biobatteries';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {EnergyTapping} from '../../../src/server/cards/base/EnergyTapping';

describe('Biobatteries', () => {
  it('play', () => {
    const card = new Biobatteries();
    const [game, player] = testGame(2);
    const tardigrades = new Tardigrades(); // microbe tag and holds microbes.
    player.playedCards.push(tardigrades);
    player.playedCards.push(new EnergyTapping()); // Energy tag

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.production.energy).eq(1);
    expect(player.stock.energy).eq(2);
    expect(tardigrades.resourceCount).eq(2);
  });
});
