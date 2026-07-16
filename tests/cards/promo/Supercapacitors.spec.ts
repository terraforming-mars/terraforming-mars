import {expect} from 'chai';
import {Supercapacitors} from '../../../src/server/cards/promo/Supercapacitors';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, doWait, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';

describe('Supercapacitors', () => {
  let card: Supercapacitors;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Supercapacitors();
    [game, player] = testGame(2);
  });

  it('When player has no energy, go straight to selecting cards', () => {
    cast(player.popWaitingFor(), undefined);
    player.production.override({energy: 1, heat: 2});
    player.playedCards.push(card);
    player.energy = 0;
    forceGenerationEnd(game);
    runAllActions(game);

    // Select cards for next generation
    cast(player.popWaitingFor(), SelectCard);
    // Production still occurs.
    expect(player.energy).eq(1);
    expect(player.heat).eq(2);
  });


  it('Behavior when player has energy', () => {
    cast(player.popWaitingFor(), undefined);
    player.playedCards.push(card);
    player.production.override({energy: 2, heat: 3});
    player.energy = 5;
    player.heat = 0;
    forceGenerationEnd(game);
    runAllActions(game);

    doWait(player, SelectAmount, (selectAmount) => {
      expect(selectAmount.max).eq(5);
      selectAmount.cb(4);
    });

    expect(player.energy).eq(3); // 5 - 4 + 2 (production)
    expect(player.heat).eq(7); // 0 + 4 + 3 (production);

    // Select cards for next generation
    cast(player.popWaitingFor(), SelectCard);
  });
});
