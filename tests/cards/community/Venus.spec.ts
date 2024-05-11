import {expect} from 'chai';
import {Venus} from '../../../src/server/cards/community/Venus';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {TerraformingControlStation} from '../../../src/server/cards/pathfinders/TerraformingControlStation';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {cast, runAllActions} from '../../TestingUtils';
import {Thermophiles} from '../../../src/server/cards/venusNext/Thermophiles';

describe('Venus', function() {
  let venus: Venus;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let localShading: LocalShading;


  beforeEach(function() {
    venus = new Venus();
    [game, player, player2] = testGame(2, {venusNextExtension: true, coloniesExtension: true});
    game.colonies.push(venus);
    localShading = new LocalShading();
  });

  it('Should activate', function() {
    // Terraforming Control Station has a Venus tag but no resources.
    const terraformingControlStation = new TerraformingControlStation();
    player.playCard(terraformingControlStation);
    expect(venus.isActive).is.false;
    player.playCard(localShading);
    expect(venus.isActive).is.true;
  });

  it('Should build', function() {
    player.playCard(localShading);

    expect(game.getVenusScaleLevel()).eq(0);
    expect(player.getTerraformRating()).eq(20);

    venus.addColony(player);

    expect(game.getVenusScaleLevel()).eq(2);
    expect(player.getTerraformRating()).eq(21);
  });

  it('Should trade', function() {
    player.playCard(localShading);
    runAllActions(game);
    venus.trackPosition = 4;
    venus.trade(player);

    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(localShading.resourceCount).to.eq(2);
  });

  it('Should give trade bonus', function() {
    player.playCard(localShading);
    runAllActions(game);

    const thermophiles = new Thermophiles();
    player2.playCard(thermophiles);
    runAllActions(game);

    venus.addColony(player);
    runAllActions(game);

    venus.trackPosition = 4;

    venus.trade(player2);
    runAllActions(game); // Gain Trade & Bonus

    expect(localShading.resourceCount).to.eq(1);
    expect(thermophiles.resourceCount).to.eq(2);
  });
});
