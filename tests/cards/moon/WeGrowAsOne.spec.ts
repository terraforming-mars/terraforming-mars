import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {WeGrowAsOne} from '../../../src/cards/moon/WeGrowAsOne';
import {expect} from 'chai';
import {Unity} from '../../../src/turmoil/parties/Unity';
import {Greens} from '../../../src/turmoil/parties/Greens';

describe('WeGrowAsOne', () => {
  let player: Player;
  let game: Game;
  let card: WeGrowAsOne;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance(
      'id',
      [player],
      player,
      TestingUtils.setCustomGameOptions({
        moonExpansion: true,
        coloniesExtension: true,
      }));
    card = new WeGrowAsOne();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    game.turmoil!.rulingParty = new Unity();
    expect(player.getPlayableCards()).does.include(card);

    game.turmoil!.rulingParty = new Greens();
    expect(player.getPlayableCards()).does.not.include(card);
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
