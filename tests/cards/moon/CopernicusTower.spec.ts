import {Game} from '../../../src/Game';
import {cast, setCustomGameOptions} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {CopernicusTower} from '../../../src/cards/moon/CopernicusTower';
import {expect} from 'chai';
import {OrOptions} from '../../../src/inputs/OrOptions';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('CopernicusTower', () => {
  let player: TestPlayer;
  let card: CopernicusTower;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new CopernicusTower();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.setProductionForTest({titanium: 2});
    expect(player.getPlayableCards()).does.include(card);

    player.setProductionForTest({titanium: 1});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('act', () => {
    card.resourceCount = 0;
    let input = card.action(player);
    expect(input).is.undefined;
    expect(card.resourceCount).eq(1);

    // Now that there's 1 resource, player will be presented with 2 options.
    input = cast(card.action(player), OrOptions);

    // The first option of which is the same: increase the resource count.
    input.options[0].cb();
    expect(card.resourceCount).eq(2);

    // The second option decreases resource count by 1 and raise the TR 1 step.
    input = cast(card.action(player), OrOptions);
    expect(player.getTerraformRating()).eq(14);
    input.options[1].cb();
    expect(card.resourceCount).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('victory points', () => {
    expect(card.getVictoryPoints(player)).eq(0);
    player.tagsForTest = {moon: 7};
    expect(card.getVictoryPoints(player)).eq(7);
  });
});

