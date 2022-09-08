import {expect} from 'chai';
import {newTestGame, TestGame} from '../../TestGame';
import {VenusFirst} from '../../../src/server/cards/pathfinders/VenusFirst';
import {Tag} from '../../../src/common/cards/Tag';
import {Player} from '../../../src/server/Player';

describe('VenusFirst', function() {
  let card: VenusFirst;
  let player: Player;
  let game: TestGame;

  beforeEach(function() {
    card = new VenusFirst();
    game = newTestGame(1, {venusNextExtension: true});
    player = game.testPlayers[0];
  });

  it('Should play', function() {
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.cardsInHand).has.lengthOf(2);

    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tag.VENUS)).not.to.eq(-1));
  });
});
