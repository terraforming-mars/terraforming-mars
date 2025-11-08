import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {ImportedNutrients} from '../../../src/server/cards/promo/ImportedNutrients';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';

describe('ImportedNutrients', () => {
  let card: ImportedNutrients;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ImportedNutrients();
    [game, player] = testGame(1, {preludeExtension: true});
  });

  it('Can play without microbe cards', () => {
    const action = card.play(player);
    expect(player.plants).to.eq(4);
    cast(action, undefined);
  });

  it('Adds microbes automatically if only 1 target', () => {
    const ants = new Ants();
    player.playedCards.push(ants);

    card.play(player);
    runAllActions(game);

    expect(player.plants).to.eq(4);
    expect(ants.resourceCount).to.eq(4);
  });

  it('Can select target if have multiple cards collecting microbes', () => {
    const ants = new Ants();
    const decomposers = new Decomposers();
    player.playedCards.push(ants, decomposers);

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);

    expect(player.plants).to.eq(4);

    action.cb([decomposers]);
    expect(decomposers.resourceCount).to.eq(4);
  });
});
