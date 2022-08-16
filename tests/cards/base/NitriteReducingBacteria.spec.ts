import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {NitriteReducingBacteria} from '../../../src/server/cards/base/NitriteReducingBacteria';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('NitriteReducingBacteria', function() {
  let card: NitriteReducingBacteria;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new NitriteReducingBacteria();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    player.playedCards.push(card);
    card.play(player);
    game.deferredActions.runNext();
    expect(card.resourceCount).to.eq(3);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(1);

    player.addResourceTo(card, 3);
    const orOptions = cast(card.action(player), OrOptions);

    orOptions.options[1].cb();
    expect(card.resourceCount).to.eq(5);

    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(2);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
