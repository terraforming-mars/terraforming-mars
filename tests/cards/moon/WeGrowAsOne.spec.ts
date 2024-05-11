import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {WeGrowAsOne} from '../../../src/server/cards/moon/WeGrowAsOne';
import {expect} from 'chai';
import {Unity} from '../../../src/server/turmoil/parties/Unity';
import {Greens} from '../../../src/server/turmoil/parties/Greens';
import {testGame} from '../../TestGame';

describe('WeGrowAsOne', () => {
  let player: TestPlayer;
  let game: IGame;
  let card: WeGrowAsOne;

  beforeEach(() => {
    [game, player] = testGame(1, {
      moonExpansion: true,
      coloniesExtension: true,
      turmoilExtension: true,
    });
    card = new WeGrowAsOne();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    game.turmoil!.rulingParty = new Unity();
    expect(player.getPlayableCardsForTest()).does.include(card);

    game.turmoil!.rulingParty = new Greens();
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    player.game.colonies[2].colonies.push(player.id);

    expect(player.game.colonies[0].trackPosition).eq(1);
    expect(player.game.colonies[1].trackPosition).eq(1);
    expect(player.game.colonies[2].trackPosition).eq(1);
    expect(player.game.colonies[3].trackPosition).eq(1);

    card.play(player);

    expect(player.game.colonies[0].trackPosition).eq(2);
    expect(player.game.colonies[1].trackPosition).eq(2);
    expect(player.game.colonies[2].trackPosition).eq(3);
    expect(player.game.colonies[3].trackPosition).eq(2);
  });
});
