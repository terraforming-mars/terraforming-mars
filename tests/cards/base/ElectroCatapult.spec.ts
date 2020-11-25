import {expect} from 'chai';
import {ElectroCatapult} from '../../../src/cards/base/ElectroCatapult';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/Resources';

describe('ElectroCatapult', function() {
  let card : ElectroCatapult; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ElectroCatapult();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play without energy production', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can\'t play if oxygen level too high', function() {
    player.addProduction(Resources.ENERGY);
    (game as any).oxygenLevel = 9;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY);
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
  it('Should act', function() {
    player.plants = 1;
    player.steel = 1;

    const action = card.action(player, game);
    expect(action instanceof OrOptions).is.true;
    expect(action!.options).has.lengthOf(2);

        action!.options[0].cb();
        expect(player.plants).to.eq(0);
        expect(player.megaCredits).to.eq(7);

        action!.options[1].cb();
        expect(player.steel).to.eq(0);
        expect(player.megaCredits).to.eq(14);
  });
});
