import {RemoveResourcesFromCard} from '../../../src/deferredActions/RemoveResourcesFromCard';
import {expect} from 'chai';
import {SolarStorm} from '../../../src/cards/pathfinders/SolarStorm';
import {Game} from '../../../src/Game';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {ResourceType} from '../../../src/common/ResourceType';

describe('SolarStorm', function() {
  let card: SolarStorm;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(function() {
    card = new SolarStorm();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player3 = TestPlayers.GREEN.newPlayer();
    Game.newInstance('foobar', [player, player2, player3], player);
  });

  it('play', function() {
    expect(player.getTerraformRating()).eq(20);
    expect(player.game.getTemperature()).eq(-30);

    player.plants = 5;
    player2.plants = 15;
    player3.plants = 400;

    card.play(player);

    expect(player.getTerraformRating()).eq(21);
    expect(player.game.getTemperature()).eq(-28);
    expect(player.plants).eq(3);
    expect(player2.plants).eq(13);
    expect(player3.plants).eq(398);
    expect(player.getProductionForTest()).deep.eq(Units.of({heat: 1}));

    // Instead of testing all the ways RemoveResourcesFromCard can work, just see that
    // it's using that.
    const pi = player.game.deferredActions.peek()!;
    expect(pi).instanceOf(RemoveResourcesFromCard);
    const rr = pi as RemoveResourcesFromCard;
    expect(rr.resourceType).eq(ResourceType.DATA);
    expect(rr.count).eq(3);
  });
});
