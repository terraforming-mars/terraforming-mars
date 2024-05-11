import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {expect} from 'chai';
import {churnAction, cast, runAllActions, setTemperature} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {SymbioticFungus} from '../../../src/server/cards/base/SymbioticFungus';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('SymbioticFungus', function() {
  let card: SymbioticFungus;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new SymbioticFungus();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setTemperature(game, -14);
    expect(card.canPlay(player)).is.true;
  });

  it('Can act without targets', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Should act - single target', function() {
    player.playedCards.push(new Ants());
    card.action(player);
    runAllActions(game);
    expect(player.playedCards[0].resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(new Ants(), new Decomposers());
    const selectCard = cast(churnAction(card, player), SelectCard);

    selectCard.cb([player.playedCards[0]]);
    expect(player.playedCards[0].resourceCount).to.eq(1);
  });
});
