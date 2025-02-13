import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions, forceGenerationEnd, cast} from '../../TestingUtils';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {Xu} from '../../../src/server/cards/ceos/Xu';


describe('Xu', () => {
  let card: Xu;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Xu();
    [game, player, player2] = testGame(2, {ceoExtension: true, venusNextExtension: true});
    player.playedCards.push(card);
    player.megaCredits = 0;
    player2.megaCredits = 0;
  });

  it('Can only act once per game', () => {
    expect(card.canAct(player)).is.true;

    card.action(player);
    runAllActions(game);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action, has the most venus tags', () => {
    player.playedCards.push(fakeCard({tags: [Tag.VENUS, Tag.VENUS, Tag.VENUS, Tag.VENUS]}));
    player2.playedCards.push(fakeCard({tags: [Tag.VENUS, Tag.VENUS]}));

    expect(player.megaCredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
    const action = card.action(player);
    cast(action, undefined);

    // Gains correct M€ amount:
    //  Venus Tags:
    //   Player1 - 5 (CEO + 4)
    //   Player2 - 2
    //   Most Venus Tags: 8
    expect(player.megaCredits).to.eq((5+2)*2 +8);
    expect(player2.megaCredits).to.eq(0);
  });

  it('Takes OPG action, ties are "friendly" to the player', () => {
    player.playedCards.push(fakeCard({tags: [Tag.VENUS]}));
    player2.playedCards.push(fakeCard({tags: [Tag.VENUS, Tag.VENUS]}));

    expect(player.megaCredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
    const action = card.action(player);
    cast(action, undefined);

    // Gains correct M€ amount:
    //  Venus Tags:
    //   Player1 - 2 (CEO + 1)
    //   Player2 - 2
    //   Most Venus Tags: 8
    expect(player.megaCredits).to.eq((2+2)*2 +8);
    expect(player2.megaCredits).to.eq(0);
  });


  it('Takes OPG action, does not Have the most Venus tags in play', () => {
    player2.playedCards.push(fakeCard({tags: [Tag.VENUS, Tag.VENUS]}));

    expect(player.megaCredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
    const action = card.action(player);
    cast(action, undefined);

    // Gains correct M€ amount:
    //  Venus Tags:
    //   Player1 - 1 (CEO)
    //   Player2 - 2
    expect(player.megaCredits).to.eq((1+2)*2);
    expect(player2.megaCredits).to.eq(0);
  });

  it('Takes OPG action, opponent players have wild tags', () => {
    player.playedCards.push(fakeCard({tags: [Tag.VENUS, Tag.VENUS, Tag.WILD]}));
    player2.playedCards.push(fakeCard({tags: [Tag.VENUS, Tag.VENUS, Tag.VENUS, Tag.WILD, Tag.WILD, Tag.WILD]}));

    expect(player.megaCredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
    const action = card.action(player);
    cast(action, undefined);

    // Gains correct M€ amount:
    //  Venus Tags:
    //   Player1 - 4 (CEO + 2 + 1 Wild)
    //   Player2 - 3 (+wilds, but not counted)
    //   Most Venus Tags: 8
    expect(player.megaCredits).to.eq((4+3)*2 +8);
    expect(player2.megaCredits).to.eq(0);
  });
});
