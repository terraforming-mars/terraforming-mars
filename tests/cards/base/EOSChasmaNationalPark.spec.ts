import {expect} from 'chai';
import {Birds} from '../../../src/server/cards/base/Birds';
import {EosChasmaNationalPark} from '../../../src/server/cards/base/EOSChasmaNationalPark';
import {Fish} from '../../../src/server/cards/base/Fish';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';

describe('EosChasmaNationalPark', () => {
  let card: EosChasmaNationalPark;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new EosChasmaNationalPark();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
    player.popSelectInitialCards();
  });

  it('Can play', () => {
    (game as any).temperature = -14;
    expect(card.canPlay(player)).is.not.true;
    (game as any).temperature = -12;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    (game as any).temperature = -12;
    const birds = new Birds();
    const fish = new Fish();
    player.playedCards.push(birds, fish);

    expect(card.canPlay(player)).is.true;
    expect(card.play(player)).is.undefined;
    expect(player.getVictoryPoints().victoryPoints).to.eq(0);
    player.playedCards.push(card);
    expect(player.getVictoryPoints().victoryPoints).to.eq(1);

    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);
    action.cb([birds]);

    expect(birds.resourceCount).to.eq(1);
    expect(player.plants).to.eq(3);
    expect(player.production.megacredits).to.eq(2);

    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.getVictoryPoints().victoryPoints).to.eq(2);
  });

  it('Should play - single target', () => {
    (game as any).temperature = -12;
    const birds = new Birds();
    player.playedCards.push(birds);

    expect(player.getVictoryPoints().victoryPoints).to.eq(0);

    expect(card.canPlay(player)).is.true;
    player.playCard(card);
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;

    expect(birds.resourceCount).to.eq(1);
    expect(player.plants).to.eq(3);
    expect(player.production.megacredits).to.eq(2);

    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.getVictoryPoints().victoryPoints).to.eq(2);
  });
});

