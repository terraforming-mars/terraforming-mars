import {expect} from 'chai';
import {AerospaceMission} from '../../../src/server/cards/community/AerospaceMission';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Io} from '../../../src/server/colonies/Io';
import {Luna} from '../../../src/server/colonies/Luna';
import {IGame} from '../../../src/server/IGame';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';


describe('AerospaceMission', () => {
  let card: AerospaceMission;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AerospaceMission();
    [game, player/* , player2 */] = testGame(2, {coloniesExtension: true});
    // Ignore randomly generated colonies, and add some colonies that can be built independently of cards
    game.colonies = [new Callisto(), new Ceres(), new Io(), new Luna()];
  });

  it('Can not play', () => {
    player.megaCredits = 13;
    expect(card.canPlay(player)).is.false;
  });

  it('Can play', () => {
    player.megaCredits = 14;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    player.megaCredits = 14;
    card.play(player);

    // Expect Callisto and Ceres to show up first and second in the colonies list, every time
    expect(game.colonies[0].name).to.eq(ColonyName.CALLISTO);
    expect(game.colonies[1].name).to.eq(ColonyName.CERES);

    // Build the first free on Callisto
    runAllActions(game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    selectColony.cb(selectColony.colonies[0]);
    expect(player.production.energy).to.eq(1);

    // Build the second free on Ceres
    runAllActions(game);
    const selectColony2 = cast(player.popWaitingFor(), SelectColony);
    selectColony2.cb(selectColony2.colonies[0]);
    expect(player.production.steel).to.eq(1);

    // Check that we built two colonies
    const builtColonies = game.colonies.filter((colony) => colony.isActive && colony.colonies.length > 0);
    expect(builtColonies).has.lengthOf(2);
    expect(builtColonies[0].colonies.find((c) => c === player.id)).is.not.undefined;
    expect(builtColonies[1].colonies.find((c) => c === player.id)).is.not.undefined;

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player.megaCredits).eq(0);
  });
});
