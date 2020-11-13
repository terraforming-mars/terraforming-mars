import {expect} from 'chai';
import {Pluto} from '../../src/colonies/Pluto';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {SelectCard} from '../../src/inputs/SelectCard';
import {IProjectCard} from '../../src/cards/IProjectCard';

describe('Pluto', function() {
  let pluto: Pluto; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    pluto = new Pluto();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(pluto);
  });

  it('Should build', function() {
    pluto.onColonyPlaced(player, game);
    expect(player.cardsInHand).has.lengthOf(2);
  });

  it('Should trade', function() {
    pluto.trade(player, game);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Should give trade bonus', function() {
    pluto.onColonyPlaced(player, game);

    pluto.trade(player2, game);

    game.deferredActions.runAll(() => {});

    const input = player.getWaitingFor()! as SelectCard<IProjectCard>;
    expect(input).to.be.an.instanceof(SelectCard);
    input.cb([input.cards[0]]); // Discard a card

    expect(player.cardsInHand).has.lengthOf(2);
    expect(player2.cardsInHand).has.lengthOf(1);
  });
});
