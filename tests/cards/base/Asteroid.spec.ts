import {expect} from 'chai';
import {Asteroid} from '../../../src/cards/base/Asteroid';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/Resources';

describe('Asteroid', function() {
  let card : Asteroid; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new Asteroid();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
  });

  it('Should play', function() {
    player2.plants = 2;
    card.play(player, game);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    orOptions.options[1].cb(); // do nothing
    expect(player2.getResource(Resources.PLANTS)).to.eq(2);

    orOptions.options[0].cb(); // remove plants
    expect(player2.getResource(Resources.PLANTS)).to.eq(0);

    expect(player.titanium).to.eq(2);
    expect(game.getTemperature()).to.eq(-28);
  });
});
