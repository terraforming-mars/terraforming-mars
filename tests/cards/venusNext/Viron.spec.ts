import {expect} from 'chai';
import {RestrictedArea} from '../../../src/server/cards/base/RestrictedArea';
import {Viron} from '../../../src/server/cards/venusNext/Viron';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('Viron', function() {
  it('Should act', function() {
    const card = new Viron();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
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
