import {expect} from 'chai';
import {cast} from '../TestingUtils';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {Pluto} from '../../src/server/colonies/Pluto';
import {Game} from '../../src/server/Game';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';

describe('Pluto', function() {
  let pluto: Pluto;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    pluto = new Pluto();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(pluto);
  });

  it('Should build', function() {
    pluto.addColony(player);
    runAllActions(game); // Draw cards
    expect(player.cardsInHand).has.lengthOf(2);
  });

  it('Should trade', function() {
    pluto.trade(player);
    runAllActions(game); // Draw cards
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Should give trade bonus', function() {
    pluto.addColony(player);

    pluto.trade(player2);

    runAllActions(game);

    const input = cast(player.getWaitingFor(), SelectCard<IProjectCard>);
    input.cb([input.cards[0]]); // Discard a card

    expect(player.cardsInHand).has.lengthOf(2);
    expect(player2.cardsInHand).has.lengthOf(1);
  });
});
