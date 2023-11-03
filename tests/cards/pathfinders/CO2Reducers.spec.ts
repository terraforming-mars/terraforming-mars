import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {CO2Reducers} from '../../../src/server/cards/pathfinders/CO2Reducers';
import {Units} from '../../../src/common/Units';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';

describe('CO2Reducers', function() {
  let card: CO2Reducers;
  let player: TestPlayer;

  beforeEach(function() {
    card = new CO2Reducers();
    [/* game */, player] = testGame(1);
  });

  it('Should play', function() {
    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3}));

    expect(player.cardsInHand).has.lengthOf(2);
    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tag.MICROBE)).not.to.eq(-1));
  });
});
