import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {expect} from 'chai';
import {churn, cast, runAllActions, setTemperature} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {SymbioticFungus} from '../../../src/server/cards/base/SymbioticFungus';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('SymbioticFungus', () => {
  let card: SymbioticFungus;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new SymbioticFungus();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setTemperature(game, -14);
    expect(card.canPlay(player)).is.true;
  });

  it('Can act without targets', () => {
    expect(card.canAct(player)).is.true;
  });

  it('Should act - single target', () => {
    player.playedCards.push(new Ants());
    card.action(player);
    runAllActions(game);
    expect(player.playedCards[0].resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', () => {
    player.playedCards.push(new Ants(), new Decomposers());
    const selectCard = cast(churn(card.action(player), player), SelectCard);

    selectCard.cb([player.playedCards[0]]);
    expect(player.playedCards[0].resourceCount).to.eq(1);
  });
});
