import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {PersonalAgenda} from '../../../src/cards/pathfinders/PersonalAgenda';
import {Game} from '../../../src/Game';
import {Units} from '../../../src/common/Units';
import {Tags} from '../../../src/common/cards/Tags';
import {TestPlayer} from '../../TestPlayer';
import {CardType} from '../../../src/common/cards/CardType';

describe('PersonalAgenda', function() {
  let card: PersonalAgenda;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new PersonalAgenda();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    card.play(player);

    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 3}));

    expect(player.cardsInHand).has.lengthOf(3);
    player.cardsInHand.forEach((card) => {
      expect(card.cardType).eq(CardType.EVENT);
      expect(card.tags.indexOf(Tags.SPACE)).to.eq(-1);
    });
  });
});
