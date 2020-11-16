import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {TradeAdvance} from '../../../src/cards/community/TradeAdvance';
import {Game} from '../../../src/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {OrOptions} from '../../../src/inputs/OrOptions';

describe('TradeAdvance', function() {
  let card : TradeAdvance; let player : Player; let game : Game;

  beforeEach(function() {
    card = new TradeAdvance();
    player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions({coloniesExtension: true});
    game = new Game('foobar', [player, player], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player, game);
    expect(player.megaCredits).not.to.eq(0);

    while (game.deferredActions.length) {
      const orOptions = game.deferredActions.next()!.execute() as OrOptions;
      orOptions.options[0].cb();
      game.deferredActions.shift();
    }

    game.colonies.forEach((colony) => expect(colony.trackPosition <= 1).is.true);
  });
});
