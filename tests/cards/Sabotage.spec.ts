import {expect} from 'chai';
import {Sabotage} from '../../src/cards/Sabotage';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {OrOptions} from '../../src/inputs/OrOptions';

describe('Sabotage', function() {
  let card : Sabotage; let player : Player; let player2: Player; let game: Game;

  beforeEach(function() {
    card = new Sabotage();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
  });

  it('Should play', function() {
    player2.titanium = 3;
    player2.steel = 4;
    player2.megaCredits = 7;

    const action = card.play(player, game) as OrOptions;

    action.options[0].cb();
    expect(player2.titanium).to.eq(0);

    action.options[1].cb();
    expect(player2.steel).to.eq(0);

    action.options[2].cb();
    expect(player2.megaCredits).to.eq(0);
  });
});
