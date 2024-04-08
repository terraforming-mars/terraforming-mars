import {expect} from 'chai';
import {cast, churn, churnAction} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {CopernicusTower} from '../../../src/server/cards/moon/CopernicusTower';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {testGame} from '../../TestGame';

describe('CopernicusTower', () => {
  let player: TestPlayer;
  let card: CopernicusTower;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new CopernicusTower();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.production.override({titanium: 2});
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.production.override({titanium: 1});
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('act', () => {
    card.resourceCount = 0;
    expect(churnAction(card, player)).is.undefined;
    expect(card.resourceCount).eq(1);

    // Now that there's 1 resource, player will be presented with 2 options.
    let input = cast(churnAction(card, player), OrOptions);

    // The second option is the same: increase the resource count.
    churn(() => input.options[1].cb(), player);
    expect(card.resourceCount).eq(2);

    // The first option decreases resource count by 1 and raise the TR 1 step.
    input = cast(churnAction(card, player), OrOptions);
    expect(player.getTerraformRating()).eq(14);
    churn(() => input.options[0].cb(), player);
    expect(card.resourceCount).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('victory points', () => {
    player.playedCards.push(card);
    expect(card.getVictoryPoints(player)).eq(1);
    player.tagsForTest = {moon: 7};
    expect(card.getVictoryPoints(player)).eq(7);
  });
});

