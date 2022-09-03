import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {SulphurEatingBacteria} from '../../../src/server/cards/venusNext/SulphurEatingBacteria';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('SulphurEatingBacteria', function() {
  let card: SulphurEatingBacteria;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new SulphurEatingBacteria();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    (game as any).venusScaleLevel = 4;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).venusScaleLevel = 6;
    expect(player.canPlayIgnoringCost(card)).is.true;
    expect(card.play(player)).is.undefined;
  });

  it('Should act - both actions available', function() {
    player.playedCards.push(card);
    player.addResourceTo(card, 5);

    const action = cast(card.action(player), OrOptions);
    action.options[1].cb(3);
    expect(player.megaCredits).to.eq(9);
    expect(card.resourceCount).to.eq(2);
  });

  it('Should act - only one action available', function() {
    player.playedCards.push(card);
    expect(card.resourceCount).to.eq(0);

    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });
});
