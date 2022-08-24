import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {DeepSpaceOperations} from '../../../src/server/cards/pathfinders/DeepSpaceOperations';
import {Game} from '../../../src/server/Game';
import {Units} from '../../../src/common/Units';
import {Tag} from '../../../src/common/cards/Tag';
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

    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    expect(player.titanium).eq(4);

    expect(player.cardsInHand).has.lengthOf(2);
    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tag.SPACE)).not.to.eq(-1));
  });
});
