import {expect} from 'chai';
import {Europa} from '../../src/server/colonies/Europa';
import {PlaceOceanTile} from '../../src/server/deferredActions/PlaceOceanTile';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {cast, runAllActions, setRulingParty} from '../TestingUtils';
import {testGame} from '../TestGame';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';

describe('Europa', () => {
  let europa: Europa;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    europa = new Europa();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(europa);
  });

  it('Should build', () => {
    europa.addColony(player);
    expect(game.deferredActions).has.lengthOf(1);
    const action = game.deferredActions.pop()!;
    expect(action).to.be.an.instanceof(PlaceOceanTile);
    expect(action.player).to.eq(player);
  });

  it('Should build, reds', () => {
    [game, player, player2] = testGame(2, {coloniesExtension: true, venusNextExtension: true, turmoilExtension: true});
    game.colonies.push(europa);

    expect(player.colonies.getPlayableColonies()).includes(europa);

    setRulingParty(game, PartyName.REDS);

    expect(player.colonies.getPlayableColonies()).does.not.include(europa);

    player.megaCredits = 3;

    expect(player.colonies.getPlayableColonies()).includes(europa);

    europa.addColony(player);

    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player.getTerraformRating()).eq(21);
    expect(player.megaCredits).eq(0);
  });

  it('Should trade', () => {
    europa.trade(player);
    expect(player.production.megacredits).to.eq(1);
    expect(player2.production.megacredits).to.eq(0);
  });

  it('Should give trade bonus', () => {
    europa.addColony(player);
    game.deferredActions.pop();

    europa.trade(player2);
    runAllActions(game);

    expect(player.production.megacredits).to.eq(0);
    expect(player2.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(1);
    expect(player2.megaCredits).to.eq(0);
  });
});
