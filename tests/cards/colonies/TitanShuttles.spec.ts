import {expect} from 'chai';
import {TitanFloatingLaunchPad} from '../../../src/cards/colonies/TitanFloatingLaunchPad';
import {TitanShuttles} from '../../../src/cards/colonies/TitanShuttles';
import {ICard} from '../../../src/cards/ICard';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('TitanShuttles', function() {
  let card : TitanShuttles; let player : Player; let game : Game;

  beforeEach(function() {
    card = new TitanShuttles();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);

    player.playedCards.push(card);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Gives VP', function() {
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Auto add floaters if only 1 option and 1 target available', function() {
    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(card.resourceCount).to.eq(2);
  });

  it('Can select target if multiple Jovian floater cards available', function() {
    const card2 = new TitanFloatingLaunchPad();
    player.playedCards.push(card2);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);

    const selectCard = game.deferredActions.peek()!.execute() as SelectCard<ICard>;
    selectCard.cb([card]);
    expect(card.resourceCount).to.eq(2);
  });

  it('Both actions available', function() {
    const card2 = new TitanFloatingLaunchPad();
    player.playedCards.push(card2);
    player.addResourceTo(card, 7);

    const orOptions = card.action(player) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;
    expect(orOptions.options).has.lengthOf(2);

    // spend floaters to gain titanium
    orOptions.options[1].cb(6);
    expect(card.resourceCount).to.eq(1);
    expect(player.titanium).to.eq(6);

    // add 2 floaters to Jovian card
    orOptions.options[0].cb();
    expect(game.deferredActions).has.lengthOf(1);

    const selectCard = game.deferredActions.peek()!.execute() as SelectCard<ICard>;
    selectCard.cb([card2]);
    expect(card2.resourceCount).to.eq(2);
  });
});
