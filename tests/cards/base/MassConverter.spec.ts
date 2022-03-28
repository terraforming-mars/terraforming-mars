import {expect} from 'chai';
import {MassConverter} from '../../../src/cards/base/MassConverter';
import {TollStation} from '../../../src/cards/base/TollStation';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';
import {Tags} from '../../../src/common/cards/Tags';

describe('MassConverter', function() {
  let card : MassConverter; let player : Player;

  beforeEach(function() {
    card = new MassConverter();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card, card, card);
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(6);
    expect(card.getCardDiscount(player, card)).to.eq(0);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);

    const fakeCard = TestingUtils.fakeCard({tags: [Tags.SPACE, Tags.SPACE, Tags.SPACE, Tags.SPACE, Tags.SPACE]});
    expect(card.getCardDiscount(player, fakeCard)).eq(2);
  });
});
