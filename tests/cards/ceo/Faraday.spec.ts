import {expect} from 'chai';
import {Faraday} from '../../../src/server/cards/ceos/Faraday';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '../../../src/common/cards/Tag';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {CardType} from '../../../src/common/cards/CardType';
import {CrewTraining} from '../../../src/server/cards/pathfinders/CrewTraining';
import {DeclareCloneTag} from '../../../src/server/pathfinders/DeclareCloneTag';
import {Leavitt} from '../../../src/server/cards/community/Leavitt';

describe('Faraday', () => {
  let card: Faraday;
  let player: TestPlayer;
  let game: IGame;
  const CARD_DRAW_COST = 3;
  const PLAYER_INITIALMC = 10;
  beforeEach(() => {
    card = new Faraday();
    [game, player] = testGame(1);

    player.popWaitingFor();
    player.megaCredits = PLAYER_INITIALMC;
    player.playedCards.push(card);
  });

  it('Nothing happens when playing the 7th tag', () => {
    // 7th here is arbitrary, just a number that isnt a multiple of 5
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));

    player.playCard(fakeCard({tags: [Tag.SCIENCE]}));
    runAllActions(player.game);
    cast(player.getWaitingFor(), undefined);
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(PLAYER_INITIALMC);
  });

  it('Can draw a card when reaching a multiple of 5 for a tag', () => {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    expect(player.cardsInHand).has.length(0);

    // 4 tags: Not sufficient
    runAllActions(player.game);
    cast(player.getWaitingFor(), undefined);

    // 5 tags: Draw a card with a Science tag
    player.playCard(fakeCard({tags: [Tag.SCIENCE]}));
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    runAllActions(game);
    expect(player.megaCredits).to.eq(PLAYER_INITIALMC - CARD_DRAW_COST);
    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tag.SCIENCE)).is.true;
  });

  it('Can choose to do nothing when reaching a multiple of 5 for a tag', () => {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));

    player.playCard(fakeCard({tags: [Tag.SCIENCE]}));
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[1].cb();
    runAllActions(game);
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(PLAYER_INITIALMC);
  });

  it('No prompt if player cannot afford to pay for card', () => {
    player.megaCredits = 1;
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));

    player.playCard(fakeCard({tags: [Tag.SCIENCE]}));
    runAllActions(player.game);
    cast(player.getWaitingFor(), undefined);
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(1);
  });

  it('Play a card with two of the same tag', () => {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    player.playCard(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE]}));

    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    runAllActions(game);
    expect(player.megaCredits).to.eq(PLAYER_INITIALMC - CARD_DRAW_COST);
    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tag.SCIENCE)).is.true;
  });

  it('Play a card that puts two tags at 5 count, buy both', () => {
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
    expect(player.megaCredits).to.eq(PLAYER_INITIALMC - CARD_DRAW_COST - CARD_DRAW_COST);
  });

  it('Play a card that puts two tags at 5 count, buy one', () => {
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
    expect(player.megaCredits).to.eq(PLAYER_INITIALMC - CARD_DRAW_COST);
  });

  it('Play a card that puts two tags at 5 count, buy none', () => {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.EARTH, Tag.EARTH, Tag.EARTH]}));

    player.playCard(fakeCard({tags: [Tag.EARTH, Tag.SCIENCE]}));
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[1].cb();
    runAllActions(game);
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(PLAYER_INITIALMC);
  });

  it('Wild tags dont count', () => {
    player.playedCards.push(fakeCard({tags: [Tag.WILD, Tag.WILD]}));
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE]}));
    player.playCard(fakeCard({tags: [Tag.SCIENCE]}));
    expect(game.deferredActions).has.length(0);
    expect(player.cardsInHand).has.length(0);
  });

  it('Does not trigger on event cards', () => {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));
    player.playCard(fakeCard({tags: [Tag.SCIENCE], type: CardType.EVENT}));
    expect(game.deferredActions).has.length(0);
    expect(player.cardsInHand).has.length(0);
  });

  it('Nothing happens when playing the Clone tag alone', () => {
    // Just give the player 4 tags of all the planets
    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.JOVIAN, Tag.VENUS, Tag.MARS, Tag.SCIENCE]}));
    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.JOVIAN, Tag.VENUS, Tag.MARS, Tag.SCIENCE]}));
    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.JOVIAN, Tag.VENUS, Tag.MARS, Tag.SCIENCE]}));
    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.JOVIAN, Tag.VENUS, Tag.MARS, Tag.SCIENCE]}));

    player.playCard(fakeCard({tags: [Tag.CLONE]}));
    runAllActions(player.game);
    cast(player.getWaitingFor(), undefined);
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(PLAYER_INITIALMC);
  });

  it('Does trigger when activating Clone Tags (via CrewTraining)', () => {
    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.EARTH, Tag.EARTH, Tag.EARTH]}));

    const crewTraining = new CrewTraining();
    player.playCard(crewTraining);
    expect(game.deferredActions).has.length(1);
    const action = cast(game.deferredActions.pop(), DeclareCloneTag);
    const options = cast(action.execute(), OrOptions);

    expect(options.options[0].title).to.match(/earth/);
    options.options[0].cb();
    runAllActions(game);

    // Now that it's Earth tags, we should be prompted to draw an Earth card
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    runAllActions(game);
    expect(player.megaCredits).to.eq(PLAYER_INITIALMC - CARD_DRAW_COST);
    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tag.EARTH)).is.true;
  });

  it('Compatible with Leavitt #6349', () => {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]}));

    const leavitt = new Leavitt();
    leavitt.addColony(player);

    runAllActions(game);

    // Now that it's Science tags, we should be prompted to draw an Science card
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    runAllActions(game);
    expect(player.megaCredits).to.eq(PLAYER_INITIALMC - CARD_DRAW_COST);
    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tag.SCIENCE)).is.true;
  });
});
