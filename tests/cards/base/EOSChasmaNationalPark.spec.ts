import {expect} from 'chai';
import {Birds} from '../../../src/cards/base/Birds';
import {EosChasmaNationalPark} from '../../../src/cards/base/EOSChasmaNationalPark';
import {Fish} from '../../../src/cards/base/Fish';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('EosChasmaNationalPark', () => {
  let card : EosChasmaNationalPark; let player : TestPlayer; let game : Game;

  beforeEach(() => {
    card = new EosChasmaNationalPark();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can play', () => {
    (game as any).temperature = -14;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    (game as any).temperature = -12;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    (game as any).temperature = -12;
    const birds = new Birds();
    const fish = new Fish();
    player.playedCards.push(birds, fish);

    expect(player.canPlayIgnoringCost(card)).is.true;
    const action = card.play(player);
    expect(action).instanceOf(SelectCard);
    player.playedCards.push(card);
        action!.cb([birds]);

        expect(player.getResourcesOnCard(birds)).to.eq(1);
        expect(player.plants).to.eq(3);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);

        player.getVictoryPoints();
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });

  it('Should play - single target', () => {
    (game as any).temperature = -12;
    const birds = new Birds();
    player.playedCards.push(birds);

    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);
    player.playedCards.push(card);

    expect(player.getResourcesOnCard(birds)).to.eq(1);
    expect(player.plants).to.eq(3);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);

    player.getVictoryPoints();
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});

