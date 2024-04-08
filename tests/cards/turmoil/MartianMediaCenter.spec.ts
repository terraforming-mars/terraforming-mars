import {expect} from 'chai';
import {MartianMediaCenter} from '../../../src/server/cards/turmoil/MartianMediaCenter';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';

describe('MartianMediaCenter', function() {
  it('Should play', function() {
    const card = new MartianMediaCenter();
    const [game, player] = testGame(1, {turmoilExtension: true});

    expect(card.canPlay(player)).is.not.true;

    const mars = game.turmoil!.getPartyByName(PartyName.MARS);
    mars.delegates.add(player, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.megacredits).to.eq(2);
  });
});
