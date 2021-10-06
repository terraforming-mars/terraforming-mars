import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {Decomposers} from '../../../src/cards/base/Decomposers';
import {SymbioticFungus} from '../../../src/cards/base/SymbioticFungus';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('SymbioticFungus', function() {
  let card : SymbioticFungus; let player : Player; let game : Game;

  beforeEach(function() {
    card = new SymbioticFungus();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
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
    expect(player.getResourcesOnCard(player.playedCards[0])).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(new Ants(), new Decomposers());
    const action = card.action(player);
    expect(action).is.not.undefined;

        action!.cb([player.playedCards[0]]);
        expect(player.getResourcesOnCard(player.playedCards[0])).to.eq(1);
  });
});
