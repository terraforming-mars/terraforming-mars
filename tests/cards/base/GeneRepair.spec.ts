import {expect} from 'chai';
import {GeneRepair} from '../../../src/cards/base/GeneRepair';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';

describe('GeneRepair', function() {
  let card : GeneRepair; let player : Player; let game : Game;

  beforeEach(function() {
    card = new GeneRepair();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card);
    expect(card.canPlay(player)).is.true;
    card.play(player, game);

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});
