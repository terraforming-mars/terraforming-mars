import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {DeepSpaceOperations} from '../../../src/server/cards/pathfinders/DeepSpaceOperations';
import {Units} from '../../../src/common/Units';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';

describe('DeepSpaceOperations', function() {
  let card: DeepSpaceOperations;
  let player: TestPlayer;

  beforeEach(function() {
    card = new DeepSpaceOperations();
    [/* game */, player] = testGame(1);
  });

  it('Should play', function() {
    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    expect(player.titanium).eq(4);

    expect(player.cardsInHand).has.lengthOf(2);
    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tag.SPACE)).not.to.eq(-1));
  });
});
