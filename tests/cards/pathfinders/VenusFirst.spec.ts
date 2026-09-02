import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {VenusFirst} from '../../../src/server/cards/pathfinders/VenusFirst';
import {Tag} from '../../../src/common/cards/Tag';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';

describe('VenusFirst', () => {
  let card: VenusFirst;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new VenusFirst();
    [game, player] = testGame(1, {venusNextExtension: true});
  });

  it('Should play', () => {
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.cardsInHand).has.lengthOf(2);

    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tag.VENUS)).not.to.eq(-1));
  });
});
