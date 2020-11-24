import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {Game, GameOptions} from '../../../src/Game';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {StrategicBasePlanning} from '../../../src/cards/community/preludes/StrategicBasePlanning';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TileType} from '../../../src/TileType';

describe('StrategicBasePlanning', function() {
  let card : StrategicBasePlanning; let player : Player; let game : Game;

  beforeEach(function() {
    card = new StrategicBasePlanning();
    player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions({coloniesExtension: true}) as GameOptions;
    game = new Game('foobar', [player, player], player, gameOptions);
  });

  it('Should play', function() {
    player.megaCredits = 6;

    card.play(player, game);
    expect(game.deferredActions).has.lengthOf(3);

    const selectColony = game.deferredActions.next()!.execute() as SelectColony;
    game.deferredActions.shift();
    selectColony.cb((<any>ColonyName)[selectColony.coloniesModel[0].name.toUpperCase()]);

    const selectSpace = game.deferredActions.next()!.execute() as SelectSpace;
    game.deferredActions.shift();

    game.deferredActions.runNext(); // howToPay

    const openColonies = game.colonies.filter((colony) => colony.isActive);
    expect(openColonies[0].colonies.find((c) => c === player.id)).is.not.undefined;

    expect(selectSpace.cb(selectSpace.availableSpaces[0])).is.undefined;
    expect(selectSpace.availableSpaces[0].player).to.eq(player);
    expect(selectSpace.availableSpaces[0].tile).is.not.undefined;
    expect(selectSpace.availableSpaces[0].tile!.tileType).to.eq(TileType.CITY);

    expect(player.megaCredits).to.eq(0);
  });
});
