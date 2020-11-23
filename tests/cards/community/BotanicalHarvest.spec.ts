import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {BotanicalHarvest} from '../../../src/cards/community/BotanicalHarvest';
import {Game} from '../../../src/Game';

describe('BotanicalHarvest', function() {
  let card : BotanicalHarvest; let player : Player; let game: Game;

  beforeEach(function() {
    card = new BotanicalHarvest();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Should play', function() {
    const initialTR = player.getTerraformRating();
    card.play(player, game);

    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.plants).to.eq(5);
    expect(game.getOxygenLevel()).to.eq(1);
    expect(player.getTerraformRating()).to.eq(initialTR + 1);
  });
});
