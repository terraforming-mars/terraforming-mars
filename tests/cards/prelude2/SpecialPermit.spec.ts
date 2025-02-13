import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SpecialPermit} from '../../../src/server/cards/prelude2/SpecialPermit';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('SpecialPermit', () => {
  let card: SpecialPermit;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    card = new SpecialPermit();
    [/* game */, player, player2] = testGame(2);
  });

  it('Play', () => {
    player.plants = 0;
    player2.plants = 4;

    card.play(player);
    const option = cast(player.game.deferredActions.pop()!.execute(), OrOptions);
    expect(option.options).has.lengthOf(2);
    option.options[0].cb();
    expect(player.plants).to.equal(4);
    expect(player2.plants).to.equal(0);
  });
});
