import {expect} from 'chai';
import {LawSuit} from '../../../src/cards/promo/LawSuit';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';

describe('LawSuit', function() {
  let card : LawSuit; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new LawSuit();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
  });

  it('Can\'t play if no resources or production reduced this turn', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play if resources removed this turn by other player', function() {
    player.setResource(Resources.MEGACREDITS, -1, game, player2);
    expect(card.canPlay(player)).is.true;
  });

  it('Can play if production decreased this turn by other player', function() {
    player.addProduction(Resources.MEGACREDITS, -1, game, player2);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    player.setResource(Resources.MEGACREDITS, -1, game, player2);
    player.addProduction(Resources.MEGACREDITS, -1, game, player2);

    const play = card.play(player, game);
    expect(play instanceof SelectPlayer).is.true;
  });
});
