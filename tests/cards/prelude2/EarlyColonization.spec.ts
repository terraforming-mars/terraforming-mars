import {TestPlayer} from '../../TestPlayer';
import {EarlyColonization} from '../../../src/server/cards/prelude2/EarlyColonization';
import {expect} from 'chai';
import {testGame} from '../../TestGame';

describe('EarlyColonization', () => {
  let player: TestPlayer;
  let card: EarlyColonization;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {
      coloniesExtension: true,
    });
    card = new EarlyColonization();
  });

  it('play', () => {
    player.game.colonies[2].colonies.push(player.id);

    expect(player.game.colonies[0].trackPosition).eq(1);
    expect(player.game.colonies[1].trackPosition).eq(1);
    expect(player.game.colonies[2].trackPosition).eq(1);
    expect(player.game.colonies[3].trackPosition).eq(1);

    card.play(player);

    expect(player.game.colonies[0].trackPosition).eq(3);
    expect(player.game.colonies[1].trackPosition).eq(3);
    expect(player.game.colonies[2].trackPosition).eq(3);
    expect(player.game.colonies[3].trackPosition).eq(3);
  });
});
