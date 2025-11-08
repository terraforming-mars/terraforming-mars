import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {PersonalAgenda} from '../../../src/server/cards/pathfinders/PersonalAgenda';
import {Units} from '../../../src/common/Units';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';
import {CardType} from '../../../src/common/cards/CardType';

describe('PersonalAgenda', () => {
  let card: PersonalAgenda;
  let player: TestPlayer;

  beforeEach(() => {
    card = new PersonalAgenda();
    [/* game */, player] = testGame(1);
  });

  it('Should play', () => {
    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3}));

    expect(player.cardsInHand).has.lengthOf(3);
    player.cardsInHand.forEach((card) => {
      expect(card.type).eq(CardType.EVENT);
      expect(card.tags.indexOf(Tag.SPACE)).to.eq(-1);
    });
  });
});
