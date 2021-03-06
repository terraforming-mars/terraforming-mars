import {expect} from 'chai';
import {AerospaceMission} from '../../../src/cards/community/AerospaceMission';
import {Iapetus} from '../../../src/cards/community/Iapetus';
import {Leavitt} from '../../../src/cards/community/Leavitt';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {Game} from '../../../src/Game';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('AerospaceMission', function() {
  let card : AerospaceMission; let player : Player; let game : Game;

  beforeEach(function() {
    card = new AerospaceMission();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
    game.colonies.push(new Iapetus(), new Leavitt()); // ensure 2 colonies are always available
  });

  it('Should play', function() {
    card.play(player);
    expect(game.deferredActions).has.lengthOf(2);

    const selectColony = game.deferredActions.peek()!.execute() as SelectColony;
    game.deferredActions.pop();
    selectColony.cb((<any>ColonyName)[selectColony.coloniesModel[0].name.toUpperCase()]);

    const selectColony2 = game.deferredActions.peek()!.execute() as SelectColony;
    game.deferredActions.pop();
    selectColony2.cb((<any>ColonyName)[selectColony2.coloniesModel[0].name.toUpperCase()]);

    const builtColonies = game.colonies.filter((colony) => colony.isActive && colony.colonies.length > 0);
    expect(builtColonies).has.lengthOf(2);
    expect(builtColonies[0].colonies.find((c) => c === player.id)).is.not.undefined;
    expect(builtColonies[1].colonies.find((c) => c === player.id)).is.not.undefined;
  });
});
