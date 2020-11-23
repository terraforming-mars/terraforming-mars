import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game, GameOptions} from '../../../src/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {HydrogenBombardment} from '../../../src/cards/community/HydrogenBombardment';
import {Resources} from '../../../src/Resources';

describe('HydrogenBombardment', function() {
  let card : HydrogenBombardment; let player : Player; let game : Game;

  beforeEach(function() {
    card = new HydrogenBombardment();
    player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions() as GameOptions;
    game = new Game('foobar', [player, player], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player, game);
    expect(game.getVenusScaleLevel()).to.eq(2);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });
});
