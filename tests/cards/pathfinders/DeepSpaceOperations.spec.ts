import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {DeepSpaceOperations} from '../../../src/cards/pathfinders/DeepSpaceOperations';
import {Game} from '../../../src/Game';
import {Units} from '../../../src/Units';
import {Tags} from '../../../src/cards/Tags';
import {TestPlayer} from '../../TestPlayer';

describe('DeepSpaceOperations', function() {
  let card: DeepSpaceOperations;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new DeepSpaceOperations();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    card.play(player);

    expect(player.getProductionForTest()).deep.eq(Units.EMPTY);
    expect(player.titanium).eq(4);

    expect(player.cardsInHand).has.lengthOf(2);
    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tags.SPACE)).not.to.eq(-1));
  });
});
