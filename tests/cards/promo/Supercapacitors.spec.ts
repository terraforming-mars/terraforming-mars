import {expect} from 'chai';
import {Supercapacitors} from '../../../src/server/cards/promo/Supercapacitors';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';

describe('Supercapacitors', () => {
  let card: Supercapacitors;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Supercapacitors();
    [game, player] = testGame(2);
  });

  it('When player has no energy, go straight to selecting cards', () => {
    expect(player.popWaitingFor()).is.undefined;
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
    expect(player.popWaitingFor()).is.undefined;
    player.playedCards.push(card);
    player.production.override({energy: 2, heat: 3});
    player.energy = 5;
    player.heat = 0;
    forceGenerationEnd(game);
    runAllActions(game);

    const [waitingFor, cb] = player.popWaitingFor2();
    const selectAmount = cast(waitingFor, SelectAmount);
    expect(selectAmount.max).eq(5);

    selectAmount.cb(4);
    cb!();

    expect(player.energy).eq(3); // 5 - 4 + 2 (production)
    expect(player.heat).eq(7); // 0 + 4 + 3 (production);

    // Select cards for next generation
    cast(player.popWaitingFor(), SelectCard);
  });
});
