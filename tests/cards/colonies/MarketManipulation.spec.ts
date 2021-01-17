import {expect} from 'chai';
import {Pets} from '../../../src/cards/base/Pets';
import {MarketManipulation} from '../../../src/cards/colonies/MarketManipulation';
import {Enceladus} from '../../../src/colonies/Enceladus';
import {Luna} from '../../../src/colonies/Luna';
import {Miranda} from '../../../src/colonies/Miranda';
import {Triton} from '../../../src/colonies/Triton';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('MarketManipulation', function() {
  let card : MarketManipulation; let player : Player; let player2: Player; let game : Game; let luna: Luna;

  beforeEach(function() {
    card = new MarketManipulation();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
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

    player.playCard(new Pets());
    expect(card.canPlay(player, game)).is.true;
  });
});
