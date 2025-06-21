import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {DesignCompany} from '../../../src/server/cards/pathfinders/DesignCompany';
import {Units} from '../../../src/common/Units';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';

describe('DesignCompany', () => {
  let card: DesignCompany;
  let player: TestPlayer;

  beforeEach(() => {
    card = new DesignCompany();
    [/* game */, player] = testGame(1);
  });

  it('Should play', () => {
    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({steel: 1}));

    expect(player.cardsInHand).has.lengthOf(3);
    player.cardsInHand.forEach((card) => {
      expect(card.tags.indexOf(Tag.BUILDING)).not.to.eq(-1);
    });
  });
});
