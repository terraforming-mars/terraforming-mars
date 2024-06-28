import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {MarsDirect} from '../../../src/server/cards/pathfinders/MarsDirect';
import {TestPlayer} from '../../TestPlayer';
import {PowerPlant} from '../../../src/server/cards/pathfinders/PowerPlant';
import {ControlledBloom} from '../../../src/server/cards/pathfinders/ControlledBloom';
import {addOcean} from '../../TestingUtils';

describe('MarsDirect', () => {
  let player: TestPlayer;
  let player2: TestPlayer;
  let card: MarsDirect;

  beforeEach(() => {
    [/* game */, player, player2] = testGame(2);
    card = new MarsDirect();
  });

  it('effect', () => {
    // Cost 13, has a mars tag
    const powerPlant = new PowerPlant();
    // Cost 13, has no mars tag.
    const controlledBloom = new ControlledBloom();

    // Controlled Bloom requires 3 oceans. Let player2 place them so player can't gain bonus.
    addOcean(player2);
    addOcean(player2);
    addOcean(player2);

    player.cardsInHand = [powerPlant, controlledBloom];
    player.corporations.push(card);

    player.tagsForTest = {mars: 0};
    player.megaCredits = 13;
    expect(player.getPlayableCardsForTest()).has.members([powerPlant, controlledBloom]);

    player.tagsForTest = {mars: 0};
    player.megaCredits = 12;
    expect(player.getPlayableCardsForTest()).is.empty;

    player.tagsForTest = {mars: 1};
    player.megaCredits = 12;
    expect(player.getPlayableCardsForTest()).has.members([powerPlant]);

    player.tagsForTest = {mars: 1};
    player.megaCredits = 11;
    expect(player.getPlayableCardsForTest()).is.empty;

    player.tagsForTest = {mars: 2};
    player.megaCredits = 11;
    expect(player.getPlayableCardsForTest()).has.members([powerPlant]);
  });
});

