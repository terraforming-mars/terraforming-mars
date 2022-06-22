import {expect} from 'chai';
import {SulphurEatingBacteria} from '../../../src/cards/venusNext/SulphurEatingBacteria';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('SulphurEatingBacteria', function() {
  let card : SulphurEatingBacteria; let player : Player; let game : Game;

  beforeEach(function() {
    card = new SulphurEatingBacteria();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    (game as any).venusScaleLevel = 4;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).venusScaleLevel = 6;
    expect(player.canPlayIgnoringCost(card)).is.true;
    expect(card.play()).is.undefined;
  });

  it('Should act - both actions available', function() {
    player.playedCards.push(card);
    player.addResourceTo(card, 5);

    const action = card.action(player) as OrOptions;
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
