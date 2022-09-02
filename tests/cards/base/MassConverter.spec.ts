import {expect} from 'chai';
import {MassConverter} from '../../../src/server/cards/base/MassConverter';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';

describe('MassConverter', function() {
  let card: MassConverter;
  let player: Player;

  beforeEach(function() {
    card = new MassConverter();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card, card, card);
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.production.energy).to.eq(6);
    expect(card.getCardDiscount(player, card)).to.eq(0);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);

    const fake = fakeCard({tags: [Tag.SPACE, Tag.SPACE, Tag.SPACE, Tag.SPACE, Tag.SPACE]});
    expect(card.getCardDiscount(player, fake)).eq(2);
  });
});
