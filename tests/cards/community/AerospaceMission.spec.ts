import {expect} from 'chai';
import {AerospaceMission} from '../../../src/cards/community/AerospaceMission';
import {Callisto} from '../../../src/colonies/Callisto';
import {Ceres} from '../../../src/colonies/Ceres';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {Io} from '../../../src/colonies/Io';
import {Luna} from '../../../src/colonies/Luna';
import {Game} from '../../../src/Game';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('AerospaceMission', function() {
  let card : AerospaceMission; let player : Player; let game : Game;

  beforeEach(function() {
    card = new AerospaceMission();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
    // Ignore randomly generated colonies, and add some colonies that can be built independently of cards
    game.colonies = [new Callisto(), new Ceres(), new Io(), new Luna()];
  });

  it('Should play', function() {
    player.megaCredits = 14;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(2);

    // Expect Callisto and Ceres to show up first and second in the colonies list, every time
    expect(game.colonies[0].name).to.eq(ColonyName.CALLISTO);
    expect(game.colonies[1].name).to.eq(ColonyName.CERES);

    // Build the first free on Callisto
    const selectColony = game.deferredActions.peek()!.execute() as SelectColony;
    game.deferredActions.pop();
    selectColony.cb(selectColony.colonies[0]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);

    // Build the second free on Ceres
    const selectColony2 = game.deferredActions.peek()!.execute() as SelectColony;
    game.deferredActions.pop();
    selectColony2.cb(selectColony2.colonies[0]);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);

    // Check that we built two colonies
    const builtColonies = game.colonies.filter((colony) => colony.isActive && colony.colonies.length > 0);
    expect(builtColonies).has.lengthOf(2);
    expect(builtColonies[0].colonies.find((c) => c === player.id)).is.not.undefined;
    expect(builtColonies[1].colonies.find((c) => c === player.id)).is.not.undefined;
  });
});
