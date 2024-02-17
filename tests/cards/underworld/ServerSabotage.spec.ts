import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {ServerSabotage} from '../../../src/server/cards/underworld/ServerSabotage';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('ServerSabotage', function() {
  let card: ServerSabotage;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new ServerSabotage();
    [game, player] = testGame(2, {underworldExpansion: true});
  });

  // TODO(kberg): add test to remove 2 data from any player.
  it('play', () => {
    const spaces = UnderworldExpansion.excavatableSpaces(player, true);
    for (const space of spaces) {
      space.undergroundResources = 'card1';
    }
    game.underworldData.tokens = [];

    const claimedSpaces = spaces.slice(0, 10);
    for (const space of claimedSpaces) {
      space.excavator = player;
    }

    player.underworldData.corruption = 0;
    card.play(player);
    player.underworldData.corruption = 1;
    expect(game.underworldData.tokens).to.have.members([
      'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1',
      'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1',
      'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1',
      'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1',
      'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1',
      'card1']);
    for (const space of spaces) {
      if (claimedSpaces.includes(space)) {
        expect(space.excavator, space.id).eq(player);
        expect(space.undergroundResources, space.id).eq('card1');
      } else {
        expect(space.excavator, space.id).is.undefined;
        expect(space.undergroundResources, space.id).is.undefined;
      }
    }
  });
});
