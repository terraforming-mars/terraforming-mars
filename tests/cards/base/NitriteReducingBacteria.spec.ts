import {expect} from 'chai';
import {NitriteReducingBacteria} from '../../../src/cards/base/NitriteReducingBacteria';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Game} from '../../../src/Game';

describe('NitriteReducingBacteria', function() {
  let card : NitriteReducingBacteria; let player : Player; let game : Game;

  beforeEach(function() {
    card = new NitriteReducingBacteria();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Should play', function() {
    player.playedCards.push(card);
    card.play(player, game);
    game.deferredActions.runNext();
    expect(card.resourceCount).to.eq(3);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player, game);
    expect(card.resourceCount).to.eq(1);

    player.addResourceTo(card, 3);
    const orOptions = card.action(player, game) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;

        orOptions!.options[1].cb();
        expect(card.resourceCount).to.eq(5);

        orOptions!.options[0].cb();
        expect(card.resourceCount).to.eq(2);
        expect(player.getTerraformRating()).to.eq(21);
  });
});
