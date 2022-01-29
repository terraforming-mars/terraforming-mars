import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {VenusFirst} from '../../../src/cards/pathfinders/VenusFirst';
import {Tags} from '../../../src/common/cards/Tags';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';

describe('VenusFirst', function() {
  let card: VenusFirst;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new VenusFirst();
    game = newTestGame(1, {venusNextExtension: true});
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.cardsInHand).has.lengthOf(2);

    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tags.VENUS)).not.to.eq(-1));
  });
});
