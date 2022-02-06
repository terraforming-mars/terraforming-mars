import {expect} from 'chai';
import {DeepWellHeating} from '../../../src/cards/base/DeepWellHeating';
import {MartianRails} from '../../../src/cards/base/MartianRails';
import {ParliamentHall} from '../../../src/cards/turmoil/ParliamentHall';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('ParliamentHall', function() {
  it('Should play', function() {
    const card = new ParliamentHall();
    const card2 = new DeepWellHeating();
    const card3 = new MartianRails();
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    const game = Game.newInstance('foobar', [player], player, gameOptions);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const mars = game.turmoil!.getPartyByName(PartyName.MARS)!;
    mars.delegates.push(player.id, player.id);
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.playedCards.push(card2, card3);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
