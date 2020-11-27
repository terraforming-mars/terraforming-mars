
import {expect} from 'chai';
import {TitaniumMine} from '../../../src/cards/base/TitaniumMine';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';

describe('TitaniumMine', function() {
  it('Should play', function() {
    const card = new TitaniumMine();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });
});
