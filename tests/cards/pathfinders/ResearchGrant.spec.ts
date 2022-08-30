import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {ResearchGrant} from '../../../src/server/cards/pathfinders/ResearchGrant';
import {Game} from '../../../src/server/Game';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';

describe('ResearchGrant', function() {
  let card: ResearchGrant;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ResearchGrant();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).eq(14);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 1}));
  });
});
