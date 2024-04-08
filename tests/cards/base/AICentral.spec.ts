import {expect} from 'chai';
import {AICentral} from '../../../src/server/cards/base/AICentral';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';

describe('AICentral', function() {
  let card: AICentral;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AICentral();
    [/* game */, player] = testGame(2);
  });

  it('Can not play if not enough science tags to play', function() {
    player.production.add(Resource.ENERGY, 1);
    player.tagsForTest = {science: 2};
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if no energy production', function() {
    player.tagsForTest = {science: 3};
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.tagsForTest = {science: 3};
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Should take action', function() {
    card.action(player);
    expect(player.cardsInHand).has.lengthOf(2);
  });
});
