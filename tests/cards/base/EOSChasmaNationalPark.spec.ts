import {expect} from 'chai';
import {Birds} from '../../../src/cards/base/Birds';
import {EosChasmaNationalPark} from '../../../src/cards/base/EOSChasmaNationalPark';
import {Fish} from '../../../src/cards/base/Fish';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

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
    const action = TestingUtils.cast(card.play(player), SelectCard);
    expect(player.getVictoryPoints().victoryPoints).to.eq(0);
    player.playedCards.push(card);
    expect(player.getVictoryPoints().victoryPoints).to.eq(1);
    action!.cb([birds]);

    expect(birds.resourceCount).to.eq(1);
    expect(player.plants).to.eq(3);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);

    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.getVictoryPoints().victoryPoints).to.eq(2);
  });

  it('Should play - single target', () => {
    (game as any).temperature = -12;
    const birds = new Birds();
    player.playedCards.push(birds);

    expect(player.getVictoryPoints().victoryPoints).to.eq(0);

    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);
    player.playedCards.push(card);

    expect(birds.resourceCount).to.eq(1);
    expect(player.plants).to.eq(3);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);

    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.getVictoryPoints().victoryPoints).to.eq(2);
  });
});

