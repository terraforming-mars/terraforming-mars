import {expect} from 'chai';
import {PowerPlantStandardProject} from '../../../../src/cards/base/standardProjects/PowerPlantStandardProject';
import {Player} from '../../../../src/Player';
import {TestingUtils} from '../../../TestingUtils';
import {TestPlayers} from '../../../TestPlayers';
import {Game} from '../../../../src/Game';
import {StandardTechnology} from '../../../../src/cards/base/StandardTechnology';
import {Resources} from '../../../../src/common/Resources';

describe('PowerPlantStandardProjects', function() {
  let card: PowerPlantStandardProject; let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new PowerPlantStandardProject();
    player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player, TestingUtils.setCustomGameOptions());
  });

  it('Should act', function() {
    player.megaCredits = 11;
    player.playedCards.push(new StandardTechnology());
    expect(game.deferredActions.length).eq(0);
    card.action(player);
    expect(game.deferredActions.length).eq(1);
    expect(player.megaCredits).eq(11);
    game.deferredActions.runNext();
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.megaCredits).eq(3);
  });
});
