import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {ResearchGrant} from '../../../src/server/cards/pathfinders/ResearchGrant';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';

describe('ResearchGrant', function() {
  let card: ResearchGrant;
  let player: TestPlayer;

  beforeEach(function() {
    card = new ResearchGrant();
    [/* game */, player] = testGame(1);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).eq(14);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 1}));
  });
});
