import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {MooncrateConvoysToMars} from '../../../src/cards/moon/MooncrateConvoysToMars';
import {expect} from 'chai';
import {SelectAmount} from '../../../src/inputs/SelectAmount';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {MarsFirst} from '../../../src/turmoil/parties/MarsFirst';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('MooncrateConvoysToMars', () => {
  let game: Game;
  let player1: Player;
  let player2: Player;
  let player3: Player;
  let moonData: IMoonData;
  let card: MooncrateConvoysToMars;

  beforeEach(() => {
    player1 = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player3 = TestPlayers.GREEN.newPlayer();
    game = Game.newInstance('id', [player1, player2, player3], player1, MOON_OPTIONS);
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

    const firstSale = game.deferredActions.pop()!.execute() as SelectAmount;
    expect(firstSale.max).eq(5);
    firstSale.cb(2);
    expect(player1.steel).eq(3);
    expect(player1.megaCredits).eq(6);

    const secondSale = game.deferredActions.pop()!.execute();
    expect(secondSale).is.undefined;

    const thirdSale = game.deferredActions.pop()!.execute() as SelectAmount;
    expect(thirdSale.max).eq(3);
  });
});
