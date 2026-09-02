import {expect} from 'chai';
import {AquiferTurbines} from '../../../src/server/cards/prelude/AquiferTurbines';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('AquiferTurbines', () => {
  let card: AquiferTurbines;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AquiferTurbines();
    [game, player] = testGame(1);
  });

  it('Can not play', () => {
    player.megaCredits = 2;
    expect(card.canPlay(player)).is.false;
  });

  it('Can play', () => {
    player.megaCredits = 3;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    player.megaCredits = 3;
    card.play(player);

    // PlaceOceanTile
    game.deferredActions.pop();

    // SelectPaymentDeferred
    game.deferredActions.runNext();

    expect(player.production.energy).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });
});
