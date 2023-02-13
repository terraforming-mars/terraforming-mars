import {expect} from 'chai';
import {Faraday} from '../../../src/server/cards/ceos/Faraday';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '../../../src/common/cards/Tag';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {CardType} from '../../../src/common/cards/CardType';


describe('Faraday', function() {
  let card: Faraday;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Faraday();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);

    player.popWaitingFor();
    player.megaCredits = 10;
    player.playedCards.push(card);
  });

  it('Nothing happens when playing the 7th tag', function() {
    // 7th here is arbitrary, just a number that isnt a multiple of 5
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    player.playCard(fakeCard({tags: [Tag.SCIENCE]}));

    runAllActions(player.game);
    expect(player.getWaitingFor()).is.undefined;
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(10);
  });


  it('Can draw a card when reaching a multiple of 5 for a tag', function() {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    // 4 tags: Not sufficient

    runAllActions(player.game);
    expect(player.getWaitingFor()).is.undefined;
    // 5 tags: Draw a card with a Science tag
    player.playCard(fakeCard({tags: [Tag.SCIENCE]}));

    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    runAllActions(game);
    expect(player.megaCredits).to.eq(8);
    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tag.SCIENCE)).is.true;
  });

  it('Can choose to do nothing when reaching a multiple of 5 for a tag', function() {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    player.playCard(fakeCard({tags: [Tag.SCIENCE]}));

    const orOptions = cast(game.deferredActions.pop()!.execute(), OrOptions);
    orOptions.options[1].cb();
    runAllActions(game);
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(10);
  });

  it('No prompt if player cannot afford to pay for card', function() {
    player.megaCredits = 1;
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    player.playCard(fakeCard({tags: [Tag.SCIENCE]}));

    runAllActions(player.game);
    expect(player.getWaitingFor()).is.undefined;
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(1);
  });

  it('Play a card with two of the same tag', function() {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    player.playCard(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE]}));

    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    runAllActions(game);
    expect(player.megaCredits).to.eq(8);
    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tag.SCIENCE)).is.true;
  });

  it('Play a card that puts two tags at 5 count, buy both', function() {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.EARTH, Tag.EARTH, Tag.EARTH]}));

    player.playCard(fakeCard({tags: [Tag.EARTH, Tag.SCIENCE]}));

    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    runAllActions(game);
    orOptions.options[0].cb();
    runAllActions(game);

    expect(player.cardsInHand).has.length(2);
    expect(player.megaCredits).to.eq(6);
  });

  it('Play a card that puts two tags at 5 count, buy one', function() {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.EARTH, Tag.EARTH, Tag.EARTH]}));

    player.playCard(fakeCard({tags: [Tag.EARTH, Tag.SCIENCE]}));

    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    runAllActions(game);
    orOptions.options[1].cb();
    runAllActions(game);

    expect(player.cardsInHand).has.length(1);
    expect(player.megaCredits).to.eq(8);
  });

  it('Play a card that puts two tags at 5 count, buy none', function() {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.EARTH, Tag.EARTH, Tag.EARTH]}));

    player.playCard(fakeCard({tags: [Tag.EARTH, Tag.SCIENCE]}));

    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[1].cb();
    runAllActions(game);

    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(10);
  });

  it('Wild tags dont count', function() {
    player.playedCards.push(fakeCard({tags: [Tag.WILD, Tag.WILD]}));
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE]}));
    player.playCard(fakeCard({tags: [Tag.SCIENCE]}));
    expect(game.deferredActions).has.length(0);
    expect(player.cardsInHand).has.length(0);
  });

  it('Does not trigger on event cards', function() {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    player.playCard(fakeCard({tags: [Tag.SCIENCE], cardType: CardType.EVENT}));
    expect(game.deferredActions).has.length(0);
    expect(player.cardsInHand).has.length(0);
  });
});
