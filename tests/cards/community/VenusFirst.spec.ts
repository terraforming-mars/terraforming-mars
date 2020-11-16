import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {VenusFirst} from '../../../src/cards/community/VenusFirst';
import {Game} from '../../../src/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {Tags} from '../../../src/cards/Tags';

describe('VenusFirst', function() {
  let card : VenusFirst; let player : Player; let game : Game;

  beforeEach(function() {
    card = new VenusFirst();
    player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions();
    game = new Game('foobar', [player, player], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player, game);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.cardsInHand).has.lengthOf(2);

    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tags.VENUS)).not.to.eq(-1));
  });
});
