import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Fish} from '../../../src/server/cards/base/Fish';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {EcologyResearch} from '../../../src/server/cards/colonies/EcologyResearch';
import {ICard} from '../../../src/server/cards/ICard';
import {Luna} from '../../../src/server/colonies/Luna';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('EcologyResearch', function() {
  let card: EcologyResearch;
  let player: Player;
  let game: Game;
  let colony1: Luna;

  beforeEach(function() {
    card = new EcologyResearch();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = testGameOptions({coloniesExtension: true});
    game = Game.newInstance('gameid', [player, redPlayer], player, gameOptions);

    colony1 = new Luna();
    colony1.colonies.push(player.id);
    player.game.colonies.push(colony1);
  });

  it('Should play without targets', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.plants).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should play with single targets', function() {
    const tardigrades = new Tardigrades();
    const fish = new Fish();
    player.playedCards.push(tardigrades, fish);

    card.play(player);
    expect(game.deferredActions).has.lengthOf(2);
    const input = game.deferredActions.peek()!.execute();
    game.deferredActions.pop();
    expect(input).is.undefined;
    const input2 = game.deferredActions.peek()!.execute();
    game.deferredActions.pop();
    expect(input2).is.undefined;

    expect(tardigrades.resourceCount).to.eq(2);
    expect(fish.resourceCount).to.eq(1);
    expect(player.production.plants).to.eq(1);
  });

  it('Should play with multiple targets', function() {
    const tardigrades = new Tardigrades();
    const ants = new Ants();
    player.playedCards.push(tardigrades, ants);

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    // add two microbes to Ants
    const selectCard = cast(game.deferredActions.peek()!.execute(), SelectCard<ICard>);
    selectCard.cb([ants]);

    expect(ants.resourceCount).to.eq(2);
    expect(player.production.plants).to.eq(1);
  });
});
