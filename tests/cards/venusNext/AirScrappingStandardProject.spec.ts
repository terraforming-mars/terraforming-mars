import {AirScrappingStandardProject} from '../../../src/cards/venusNext/AirScrappingStandardProject';
import {expect} from 'chai';
import {TestingUtils} from 'tests/TestingUtils';
import {TestPlayer} from 'tests/TestPlayer';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('AirScrappingStandardProject', function() {
  let card: AirScrappingStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AirScrappingStandardProject();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({altVenusBoard: false}));
  });

  it('Can act', function() {
    player.megaCredits = 14;
    expect(card.canAct(player)).is.false;
    player.megaCredits = 15;
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    player.megaCredits = 15;
    player.setTerraformRating(20);
    expect(game.getVenusScaleLevel()).eq(0);

    card.action(player);
    TestingUtils.runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(player.getTerraformRating()).eq(21);
    expect(game.getVenusScaleLevel()).eq(2);
  });
});
