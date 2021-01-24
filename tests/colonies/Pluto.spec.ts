import {expect} from 'chai';
import {IProjectCard} from '../../src/cards/IProjectCard';
import {Pluto} from '../../src/colonies/Pluto';
import {Game} from '../../src/Game';
import {SelectCard} from '../../src/inputs/SelectCard';
import {Player} from '../../src/Player';
import * as utils from '../TestingUtils';

describe('Pluto', function() {
  let pluto: Pluto; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    pluto = new Pluto();
    player = utils.TestPlayers.BLUE.newPlayer();
    player2 = utils.TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(pluto);
  });

  it('Should build', function() {
    pluto.addColony(player);
    utils.runAllActions(game); // Draw cards
    expect(player.cardsInHand).has.lengthOf(2);
  });

  it('Should trade', function() {
    pluto.trade(player);
    utils.runAllActions(game); // Draw cards
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Should give trade bonus', function() {
    pluto.addColony(player);

    pluto.trade(player2);

    utils.runAllActions(game);

    const input = player.getWaitingFor()! as SelectCard<IProjectCard>;
    expect(input).to.be.an.instanceof(SelectCard);
    input.cb([input.cards[0]]); // Discard a card

    expect(player.cardsInHand).has.lengthOf(2);
    expect(player2.cardsInHand).has.lengthOf(1);
  });
});
