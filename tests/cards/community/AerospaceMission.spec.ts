import {expect} from 'chai';
import {AerospaceMission} from '../../../src/server/cards/community/AerospaceMission';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Io} from '../../../src/server/colonies/Io';
import {Luna} from '../../../src/server/colonies/Luna';
import {Game} from '../../../src/server/Game';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('AerospaceMission', function() {
  let card: AerospaceMission;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new AerospaceMission();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = testGameOptions({coloniesExtension: true});
    game = Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
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
    const selectColony = cast(game.deferredActions.peek()!.execute(), SelectColony);
    game.deferredActions.pop();
    selectColony.cb(selectColony.colonies[0]);
    expect(player.production.energy).to.eq(1);

    // Build the second free on Ceres
    const selectColony2 = cast(game.deferredActions.peek()!.execute(), SelectColony);
    game.deferredActions.pop();
    selectColony2.cb(selectColony2.colonies[0]);
    expect(player.production.steel).to.eq(1);

    // Check that we built two colonies
    const builtColonies = game.colonies.filter((colony) => colony.isActive && colony.colonies.length > 0);
    expect(builtColonies).has.lengthOf(2);
    expect(builtColonies[0].colonies.find((c) => c === player.id)).is.not.undefined;
    expect(builtColonies[1].colonies.find((c) => c === player.id)).is.not.undefined;
  });
});
