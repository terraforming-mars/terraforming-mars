import {expect} from 'chai';
import {AirRaid} from '../../../src/cards/colonies/AirRaid';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {Player} from '../../../src/Player';
import {StormCraftIncorporated} from '../../../src/cards/colonies/StormCraftIncorporated';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {ICard} from '../../../src/cards/ICard';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestPlayers} from '../../TestPlayers';

describe('AirRaid', function() {
  let card : AirRaid; let player : Player; let player2 : Player; let corpo: StormCraftIncorporated;

  beforeEach(function() {
    card = new AirRaid();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);

    corpo = new StormCraftIncorporated();
    player.corporationCard = corpo;
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play - multiple targets', function() {
    const player3 = TestPlayers.YELLOW.newPlayer();
    Game.newInstance('foobar', [player, player2, player3], player);
    player.addResourceTo(corpo);
    expect(card.canPlay(player)).is.true;

    const otherCardWithFloater = new Dirigibles();
    player.playedCards.push(otherCardWithFloater);
    player.addResourceTo(otherCardWithFloater);
    player2.megaCredits = 4;

    card.play(player);
    const option1 = player.game.deferredActions.pop()!.execute() as OrOptions;
    const option2 = player.game.deferredActions.pop()!.execute() as SelectCard<ICard>;

    option1.options[0].cb();
    expect(player2.megaCredits).to.eq(0);
    expect(player.megaCredits).to.eq(4);

    option2.cb([corpo]);
    expect(player.getResourcesOnCard(corpo)).to.eq(0);
  });

  it('Should play - single target for floater removal and MC removal', function() {
    player.addResourceTo(corpo);
    expect(card.canPlay(player)).is.true;

    player2.megaCredits = 4;
    card.play(player);

    const option = player.game.deferredActions.pop()!.execute() as OrOptions; // Steal money
    expect(option.options).has.lengthOf(2);
    option.options[0].cb();
    player.game.deferredActions.pop()!.execute(); // Remove floater

    expect(player.getResourcesOnCard(corpo)).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
    expect(player.megaCredits).to.eq(4);
  });
});
