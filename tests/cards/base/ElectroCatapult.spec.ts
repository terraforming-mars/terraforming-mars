import {expect} from 'chai';
import {ElectroCatapult} from '../../../src/cards/base/ElectroCatapult';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/Resources';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('ElectroCatapult', () => {
  let card : ElectroCatapult; let player : TestPlayer; let game : Game;

  beforeEach(() => {
    card = new ElectroCatapult();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Cannot play without energy production', () => {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Cannot play if oxygen level too high', () => {
    player.addProduction(Resources.ENERGY, 1);
    (game as any).oxygenLevel = 9;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', () => {
    player.setProductionForTest({energy: 1});
    (game as any).oxygenLevel = 8;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    player.addProduction(Resources.ENERGY, 1);
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
  it('Should act', () => {
    player.plants = 1;
    player.steel = 1;

    const action = card.action(player);
    expect(action).instanceOf(OrOptions);
    expect(action!.options).has.lengthOf(2);

        action!.options[0].cb();
        expect(player.plants).to.eq(0);
        expect(player.megaCredits).to.eq(7);

        action!.options[1].cb();
        expect(player.steel).to.eq(0);
        expect(player.megaCredits).to.eq(14);
  });
});
