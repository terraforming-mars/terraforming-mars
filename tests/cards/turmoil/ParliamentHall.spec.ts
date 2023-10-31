import {expect} from 'chai';
import {DeepWellHeating} from '../../../src/server/cards/base/DeepWellHeating';
import {MartianRails} from '../../../src/server/cards/base/MartianRails';
import {ParliamentHall} from '../../../src/server/cards/turmoil/ParliamentHall';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';

describe('ParliamentHall', function() {
  it('Should play', function() {
    const card = new ParliamentHall();
    const card2 = new DeepWellHeating();
    const card3 = new MartianRails();
    const [game, player] = testGame(1, {turmoilExtension: true});

    expect(player.simpleCanPlay(card)).is.not.true;

    const mars = game.turmoil!.getPartyByName(PartyName.MARS);
    mars.delegates.add(player, 2);
    expect(player.simpleCanPlay(card)).is.true;

    player.playedCards.push(card2, card3);
    card.play(player);
    expect(player.production.megacredits).to.eq(1);
  });
});
