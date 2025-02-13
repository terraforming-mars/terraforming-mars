import {expect} from 'chai';
import {WaterImportFromEuropa} from '../../../src/server/cards/base/WaterImportFromEuropa';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('WaterImportFromEuropa', () => {
  let card: WaterImportFromEuropa;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new WaterImportFromEuropa();
    [game, player] = testGame(2);
  });

  it('Can not act', () => {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', () => {
    card.play(player);
    player.playedCards.push(card);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Should act', () => {
    player.megaCredits = 13;

    const action = card.action(player);
    cast(action, undefined);

    game.deferredActions.runNext(); // Payment
    expect(player.megaCredits).to.eq(1);

    expect(game.deferredActions).has.lengthOf(1);
    const selectOcean = cast(game.deferredActions.peek()!.execute(), SelectSpace);
    selectOcean.cb(selectOcean.spaces[0]);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Can act if can pay even after oceans are maxed', () => {
    maxOutOceans(player);
    player.megaCredits = 12;

    expect(card.canAct(player)).is.true;
  });
});
