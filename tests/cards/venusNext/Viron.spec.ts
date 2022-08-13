import {expect} from 'chai';
import {RestrictedArea} from '../../../src/server/cards/base/RestrictedArea';
import {Viron} from '../../../src/server/cards/venusNext/Viron';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';

describe('Viron', function() {
  it('Should act', function() {
    const card = new Viron();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    const action = card.play();
    expect(action).is.undefined;
    player.setCorporationForTest(card);
    player.playedCards.push(new RestrictedArea());
    player.addActionThisGeneration(new RestrictedArea().name);
    expect(card.canAct(player)).is.not.true;
    player.megaCredits += 2;
    expect(card.canAct(player)).is.true;
    const action2 = card.action(player);
    expect(action2).is.not.undefined;
    expect(action2 instanceof SelectCard).is.true;
  });
});
