import {expect} from 'chai';
import {VenusFirst} from '../../../src/server/cards/community/VenusFirst';
import {Tag} from '../../../src/common/cards/Tag';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('VenusFirst', function() {
  let card: VenusFirst;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new VenusFirst();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.cardsInHand).has.lengthOf(2);

    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tag.VENUS)).not.to.eq(-1));
  });
});
