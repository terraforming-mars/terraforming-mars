import {expect} from 'chai';
import {NitriteReducingBacteria} from '../../../src/cards/base/NitriteReducingBacteria';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import * as utils from '../../TestingUtils';

describe('NitriteReducingBacteria', function() {
  let card : NitriteReducingBacteria; let player : Player; let game : Game;

  beforeEach(function() {
    card = new NitriteReducingBacteria();
    player = utils.TestPlayers.BLUE.newPlayer();
    const redPlayer = utils.TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    player.playedCards.push(card);
    card.play(player);
    utils.runNextAction(game);
    expect(card.resourceCount).to.eq(3);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(1);

    player.addResourceTo(card, 3);
    const orOptions = card.action(player) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;

    orOptions!.options[1].cb();
    expect(card.resourceCount).to.eq(5);

    orOptions!.options[0].cb();
    expect(card.resourceCount).to.eq(2);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
