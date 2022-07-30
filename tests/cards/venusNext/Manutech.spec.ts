import {expect} from 'chai';
import {PowerPlantStandardProject} from '../../../src/cards/base/standardProjects/PowerPlantStandardProject';
import {Manutech} from '../../../src/cards/venusNext/Manutech';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Manutech', function() {
  let card: Manutech;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Manutech();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
    player.setCorporationForTest(card);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.steel).to.eq(1);
  });

  it('Should add energy resources by Power Plant standard project', function() {
    player.megaCredits = 11;
    new PowerPlantStandardProject().action(player);
    game.deferredActions.pop()!.execute();
    expect(player.getResource(Resources.ENERGY)).to.eq(1);
  });
});
