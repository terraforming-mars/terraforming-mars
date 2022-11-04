import {expect} from 'chai';
import {Leavitt} from '../../../src/server/cards/community/Leavitt';
import {Vitor} from '../../../src/server/cards/prelude/Vitor';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '../../../src/common/cards/Tag';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('Leavitt', function() {
  let leavitt: Leavitt;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    leavitt = new Leavitt();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(leavitt);
    player.popSelectInitialCards();
    player2.popSelectInitialCards();
  });

  it('Should build', function() {
    expect(player.tags.count(Tag.SCIENCE)).to.eq(0);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(1);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(2);
  });

  it('Should trade + bonus', function() {
    leavitt.addColony(player2);
    leavitt.trackPosition = 4;
    leavitt.trade(player);
    player.megaCredits = 5;
    player2.megaCredits = 5;
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);

    expect(selectCard.cards).has.length(5);

    selectCard.cb([selectCard.cards[0]]);

    expect(player.cardsInHand).deep.eq([selectCard.cards[0]]);

    runAllActions(game);

    const selectCard2 = cast(player2.popWaitingFor(), SelectCard);

    expect(selectCard2.cards).has.length(1);
    expect(selectCard2.config.max).eq(1);

    selectCard2.cb([selectCard2.cards[0]]);

    runAllActions(game);

    expect(player2.megaCredits).eq(2);
    expect(player.megaCredits).eq(5);
    expect(player2.cardsInHand).deep.eq([selectCard2.cards[0]]);
  });

  it('Should trade + bonus, player cannot afford bonus', function() {
    leavitt.addColony(player2);
    leavitt.trackPosition = 4;
    leavitt.trade(player);
    player.megaCredits = 5;
    player2.megaCredits = 1;
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);

    expect(selectCard.cards).has.length(5);

    selectCard.cb([selectCard.cards[0]]);

    expect(player.cardsInHand).deep.eq([selectCard.cards[0]]);

    runAllActions(game);

    const selectCard2 = cast(player2.popWaitingFor(), SelectCard);

    expect(selectCard2.cards).has.length(1);
    expect(selectCard2.config.max).eq(0);

    expect(() => selectCard2.cb([selectCard2.cards[0]])).to.throw(/Selected too many cards/);

    selectCard2.cb([]);

    runAllActions(game);

    expect(player2.megaCredits).eq(1);
    expect(player.megaCredits).eq(5);
    expect(player2.cardsInHand).is.empty;
  });

  it('Leavitt is compatible with Vitor', () => {
    // This test verifies that a regression doesn't reoccur.
    // Merely completing these is sufficient because
    // it doesn't throw an Error.
    player.setCorporationForTest(new Vitor());
    expect(player.tags.count(Tag.SCIENCE)).to.eq(0);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(1);
  });
});
