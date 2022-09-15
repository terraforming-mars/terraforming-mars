import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {CopernicusTower} from '../../../src/server/cards/moon/CopernicusTower';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('CopernicusTower', () => {
  let player: TestPlayer;
  let card: CopernicusTower;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new CopernicusTower();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.production.override({titanium: 2});
    expect(player.getPlayableCards()).does.include(card);

    player.production.override({titanium: 1});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('act', () => {
    card.resourceCount = 0;
    let input = card.action(player);
    expect(input).is.undefined;
    expect(card.resourceCount).eq(1);

    // Now that there's 1 resource, player will be presented with 2 options.
    input = cast(card.action(player), OrOptions);

    // The second option is the same: increase the resource count.
    input.options[1].cb();
    expect(card.resourceCount).eq(2);

    // The first option decreases resource count by 1 and raise the TR 1 step.
    input = cast(card.action(player), OrOptions);
    expect(player.getTerraformRating()).eq(14);
    input.options[0].cb();
    expect(card.resourceCount).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('victory points', () => {
    expect(card.getVictoryPoints(player)).eq(0);
    player.tagsForTest = {moon: 7};
    expect(card.getVictoryPoints(player)).eq(7);
  });
});

