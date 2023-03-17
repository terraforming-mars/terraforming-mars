import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {SymbioticFungus} from '../../../src/server/cards/base/SymbioticFungus';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('SymbioticFungus', function() {
  let card: SymbioticFungus;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new SymbioticFungus();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -14;
    expect(player.canPlayIgnoringCost(card)).is.true;
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
    expect(card.action(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);

    action.cb([player.playedCards[0]]);
    expect(player.playedCards[0].resourceCount).to.eq(1);
  });
});
