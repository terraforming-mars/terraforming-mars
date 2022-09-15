import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MooncrateConvoysToMars} from '../../../src/server/cards/moon/MooncrateConvoysToMars';
import {expect} from 'chai';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {MarsFirst} from '../../../src/server/turmoil/parties/MarsFirst';

describe('MooncrateConvoysToMars', () => {
  let game: Game;
  let player1: Player;
  let player2: Player;
  let player3: TestPlayer;
  let moonData: IMoonData;
  let card: MooncrateConvoysToMars;

  beforeEach(() => {
    player1 = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    player3 = TestPlayer.GREEN.newPlayer();
    game = Game.newInstance('gameid', [player1, player2, player3], player1, testGameOptions({moonExpansion: true, turmoilExtension: true}));
    moonData = MoonExpansion.moonData(game);
    card = new MooncrateConvoysToMars();
  });

  it('can play', () => {
    player1.cardsInHand = [card];
    player1.megaCredits = card.cost;

    game.turmoil!.rulingParty = new MarsFirst();
    expect(player1.getPlayableCards()).does.include(card);

    game.turmoil!.rulingParty = new Reds();
    expect(player1.getPlayableCards()).does.not.include(card);
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
