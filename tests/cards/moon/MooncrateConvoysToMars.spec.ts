import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MooncrateConvoysToMars} from '../../../src/server/cards/moon/MooncrateConvoysToMars';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {MarsFirst} from '../../../src/server/turmoil/parties/MarsFirst';
import {testGame} from '../../TestGame';

describe('MooncrateConvoysToMars', () => {
  let game: IGame;
  let player1: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let moonData: MoonData;
  let card: MooncrateConvoysToMars;

  beforeEach(() => {
    [game, player1, player2, player3] = testGame(3, {moonExpansion: true, turmoilExtension: true});
    moonData = MoonExpansion.moonData(game);
    card = new MooncrateConvoysToMars();
  });

  it('can play', () => {
    player1.cardsInHand = [card];
    player1.megaCredits = card.cost;

    game.turmoil!.rulingParty = new MarsFirst();
    expect(player1.getPlayableCardsForTest()).does.include(card);

    game.turmoil!.rulingParty = new Reds();
    expect(player1.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    expect(moonData.logisticRate).eq(0);

    player1.steel = 5;
    player1.megaCredits = 0;
    player2.steel = 0;
    player2.megaCredits = 0;
    player3.steel = 3;
    player3.megaCredits = 0;

    card.play(player1);

    expect(moonData.logisticRate).eq(1);

    const firstSale = cast(game.deferredActions.pop()!.execute(), SelectAmount);
    expect(firstSale.max).eq(5);
    firstSale.cb(2);
    expect(player1.steel).eq(3);
    expect(player1.megaCredits).eq(6);

    const secondSale = game.deferredActions.pop()!.execute();
    expect(secondSale).is.undefined;

    const thirdSale = cast(game.deferredActions.pop()!.execute(), SelectAmount);
    expect(thirdSale.max).eq(3);
  });
});
