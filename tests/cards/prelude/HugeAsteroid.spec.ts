import {expect} from 'chai';
import {HugeAsteroid} from '../../../src/server/cards/prelude/HugeAsteroid';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('HugeAsteroid', () => {
  let card: HugeAsteroid;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new HugeAsteroid();
    [game, player] = testGame(1);
  });

  it('Can not play', () => {
    player.megaCredits = 4;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.megaCredits = 5;
    expect(card.canPlay(player)).is.true;
    const initialTR = player.getTerraformRating();

    card.play(player);

    // SelectPaymentDeferred
    game.deferredActions.runNext();

    expect(player.megaCredits).to.eq(0);
    expect(player.production.heat).to.eq(1);
    expect(player.getTerraformRating()).to.eq(initialTR + 3);
  });
});
