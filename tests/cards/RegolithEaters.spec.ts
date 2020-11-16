import {expect} from 'chai';
import {RegolithEaters} from '../../src/cards/RegolithEaters';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {OrOptions} from '../../src/inputs/OrOptions';

describe('RegolithEaters', function() {
  let card : RegolithEaters; let player : Player; let game : Game;

  beforeEach(function() {
    card = new RegolithEaters();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    const action = card.action(player, game);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);

    card.action(player, game);
    expect(card.resourceCount).to.eq(2);
    const orOptions = card.action(player, game) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;

        orOptions!.options[1].cb();
        expect(card.resourceCount).to.eq(3);

        orOptions!.options[0].cb();
        expect(card.resourceCount).to.eq(1);
        expect(game.getOxygenLevel()).to.eq(1);
  });
});
