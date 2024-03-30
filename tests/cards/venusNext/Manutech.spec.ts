import {expect} from 'chai';
import {PowerPlantStandardProject} from '../../../src/server/cards/base/standardProjects/PowerPlantStandardProject';
import {Manutech} from '../../../src/server/cards/venusNext/Manutech';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Manutech', function() {
  let card: Manutech;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Manutech();
    [game, player] = testGame(2);
    player.setCorporationForTest(card);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.production.steel).to.eq(1);
    expect(player.stock.steel).to.eq(1);
  });

  it('Should add energy resources by Power Plant standard project', function() {
    player.stock.megacredits = 11;
    new PowerPlantStandardProject().action(player);
    game.deferredActions.pop()!.execute();
    expect(player.stock.energy).to.eq(1);
  });
});
