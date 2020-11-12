import {expect} from 'chai';
import {MarketManipulation} from '../../../src/cards/colonies/MarketManipulation';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Luna} from '../../../src/colonies/Luna';
import {Triton} from '../../../src/colonies/Triton';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Miranda} from '../../../src/colonies/Miranda';
import {Enceladus} from '../../../src/colonies/Enceladus';
import {Pets} from '../../../src/cards/Pets';

describe('MarketManipulation', function() {
  let card : MarketManipulation; let player : Player; let player2: Player; let game : Game; let luna: Luna;

  beforeEach(function() {
    card = new MarketManipulation();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
    luna = new Luna();
  });

  it('Should play', function() {
    const triton = new Triton();
    game.colonies.push(luna, triton);

    const action = card.play(player, game) as OrOptions;
    expect(action).is.not.undefined;
    expect(action.options[0].title).to.eq('Increase Luna (MegaCredits) and decrease Triton (Titanium)');
    action.options[0].cb();

    expect(luna.trackPosition).to.eq(2);
    expect(triton.trackPosition).to.eq(0);
  });

  it('Can\'t play', function() {
    const enceladus = new Enceladus();
    const miranda = new Miranda();

    game.colonies.push(enceladus, miranda, luna);
    game.gameOptions.coloniesExtension = true;
    expect(card.canPlay(player, game)).is.not.true;

    player.playCard(game, new Pets());
    expect(card.canPlay(player, game)).is.true;
  });
});
