import {expect} from 'chai';
import {ICard} from '../../../src/cards/ICard';
import {AerialMappers} from '../../../src/cards/venusNext/AerialMappers';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('AerialMappers', function() {
  let card : AerialMappers; let player : Player; let game : Game;

  beforeEach(function() {
    card = new AerialMappers();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
    player.playedCards.push(card);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act - multiple targets', function() {
    const card2 = new Dirigibles();
    player.playedCards.push(card2);
    const action = card.action(player, game) as SelectCard<ICard>;
    expect(action instanceof SelectCard).is.true;

    action.cb([card]);
    expect(card.resourceCount).to.eq(1);

    const orOptions = card.action(player, game) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;

    orOptions.options[0].cb([card]);
    expect(card.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Should act - single target', function() {
    card.action(player, game);
    expect(card.resourceCount).to.eq(1);

    const orOptions = card.action(player, game) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;
    orOptions.options[0].cb([card]);
    expect(card.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
