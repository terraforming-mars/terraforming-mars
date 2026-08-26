import {expect} from 'chai';
import {Biobatteries} from '../../../src/server/cards/underworld/Biobatteries';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {EnergyTapping} from '../../../src/server/cards/base/EnergyTapping';
import {ResearchNetwork} from '../../../src/server/cards/prelude/ResearchNetwork';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {cast} from '../../../src/common/utils/utils';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';

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

  it('play, with wild tags, distributes them', () => {
    const card = new Biobatteries();
    const [game, player] = testGame(2);
    const tardigrades = new Tardigrades(); // microbe tag and holds microbes.
    player.playedCards.push(tardigrades);
    player.playedCards.push(new EnergyTapping()); // Energy tag
    player.playedCards.push(new ResearchNetwork()); // Wild tag
    player.playedCards.push(new ResearchCoordination()); // Wild tag

    const selectAmount = cast(card.play(player), SelectAmount);

    expect(selectAmount.min).eq(0);
    expect(selectAmount.max).eq(2);

    selectAmount.process({type: 'amount', amount: 1});
    runAllActions(game);

    expect(player.stock.energy).eq(3);
    expect(tardigrades.resourceCount).eq(3);
  });

  it('play, with wild tags, but no microbe cards', () => {
    const card = new Biobatteries();
    const [game, player] = testGame(2);
    player.playedCards.push(new EnergyTapping()); // Energy tag
    player.playedCards.push(new ResearchNetwork()); // Wild tag

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.stock.energy).eq(2);
    expect(player.getCardsWithResources()).is.empty;
  });
});
