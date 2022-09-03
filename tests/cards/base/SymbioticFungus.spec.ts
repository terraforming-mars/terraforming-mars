import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {SymbioticFungus} from '../../../src/server/cards/base/SymbioticFungus';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('SymbioticFungus', function() {
  let card: SymbioticFungus;
  let player: Player;
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
    expect(card.canAct()).is.true;
  });

  it('Should act - single target', function() {
    player.playedCards.push(new Ants());
    card.action(player);
    expect(player.playedCards[0].resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(new Ants(), new Decomposers());
    const action = cast(card.action(player), SelectCard);

    action.cb([player.playedCards[0]]);
    expect(player.playedCards[0].resourceCount).to.eq(1);
  });
});
