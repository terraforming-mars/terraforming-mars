import {expect} from 'chai';
import {TopsoilContract} from '../../../src/server/cards/promo/TopsoilContract';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Ants} from '../../../src/server/cards/base/Ants';
import {IGame} from '../../../src/server/IGame';
import {AerobrakedAmmoniaAsteroid} from '../../../src/server/cards/base/AerobrakedAmmoniaAsteroid';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('TopsoilContract', () => {
  let card: TopsoilContract;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new TopsoilContract();
    [game, player, player2] = testGame(2);
  });

  it('Can play', () => {
    card.play(player);
    runAllActions(game);

    expect(player.plants).to.eq(3);
  });

  it('Gives 1 M€ whenever player gains a microbe', () => {
    player.playedCards.push(card);

    // Get MC when player gains microbes
    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);
    tardigrades.action(player);
    runAllActions(game);
    expect(player.megaCredits).to.eq(1);

    const aerobrakedAmmoniaAsteroid = new AerobrakedAmmoniaAsteroid();
    aerobrakedAmmoniaAsteroid.play(player);
    runAllActions(game);
    expect(tardigrades.resourceCount).to.eq(3);
    expect(player.megaCredits).to.eq(3);

    // Don't get MC when other players gain microbes
    const ants = new Ants();
    player2.playedCards.push(ants);
    ants.action(player2);
    runAllActions(game);
    expect(player.megaCredits).to.eq(3);
  });
});
