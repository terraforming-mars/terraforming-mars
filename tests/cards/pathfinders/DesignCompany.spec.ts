import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {DesignCompany} from '../../../src/cards/pathfinders/DesignCompany';
import {Game} from '../../../src/Game';
import {Units} from '../../../src/common/Units';
import {Tags} from '../../../src/common/cards/Tags';
import {TestPlayer} from '../../TestPlayer';

describe('DesignCompany', function() {
  let card: DesignCompany;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new DesignCompany();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    card.play(player);

    expect(player.getProductionForTest()).deep.eq(Units.of({steel: 1}));

    expect(player.cardsInHand).has.lengthOf(3);
    player.cardsInHand.forEach((card) => {
      expect(card.tags.indexOf(Tags.BUILDING)).not.to.eq(-1);
    });
  });
});
