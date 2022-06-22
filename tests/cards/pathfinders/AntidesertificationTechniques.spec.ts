import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {AntidesertificationTechniques} from '../../../src/cards/pathfinders/AntidesertificationTechniques';
import {Game} from '../../../src/Game';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';

describe('AntidesertificationTechniques', function() {
  let card: AntidesertificationTechniques;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AntidesertificationTechniques();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).eq(5);
    expect(player.getProductionForTest()).deep.eq(Units.of({plants: 1, steel: 1}));
  });
});
