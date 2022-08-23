import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {DesignCompany} from '../../../src/server/cards/pathfinders/DesignCompany';
import {Game} from '../../../src/server/Game';
import {Units} from '../../../src/common/Units';
import {Tag} from '../../../src/common/cards/Tag';
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

    expect(player.production.asUnits()).deep.eq(Units.of({steel: 1}));

    expect(player.cardsInHand).has.lengthOf(3);
    player.cardsInHand.forEach((card) => {
      expect(card.tags.indexOf(Tag.BUILDING)).not.to.eq(-1);
    });
  });
});
