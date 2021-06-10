
import {expect} from 'chai';
import {Algae} from '../src/cards/base/Algae';
import {Ants} from '../src/cards/base/Ants';
import {Birds} from '../src/cards/base/Birds';
import {Game} from '../src/Game';
import {LogHelper} from '../src/LogHelper';
import {TestPlayers} from './TestPlayers';

describe('LogHelper', function() {
  it('logs drawn cards by card', function() {
    const player1 = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const card1 = new Algae();
    const card2 = new Ants();
    const card3 = new Birds();
    const game = Game.newInstance('foobar', [player1, player2], player1);
    LogHelper.logDrawnCards(player1, []);
    let msg = game.gameLog.pop();
    expect(msg!.message).to.eq('${0} drew no cards');
    LogHelper.logDrawnCards(player1, [card1]);
    msg = game.gameLog.pop()!;
    expect(msg.data.length).to.eq(2);
    expect(msg.data[0].value).to.eq(player1.color);
    expect(msg.data[1].value).to.eq(card1.name);
    expect(msg.message).to.eq('${0} drew ${1}');
    LogHelper.logDrawnCards(player1, [card1, card2]);
    msg = game.gameLog.pop()!;
    expect(msg.data.length).to.eq(3);
    expect(msg.data[0].value).to.eq(player1.color);
    expect(msg.data[1].value).to.eq(card1.name);
    expect(msg.data[2].value).to.eq(card2.name);
    expect(msg.message).to.eq('${0} drew ${1} and ${2}');
    LogHelper.logDrawnCards(player1, [card1, card2, card3]);
    msg = game.gameLog.pop()!;
    expect(msg.data.length).to.eq(4);
    expect(msg.data[0].value).to.eq(player1.color);
    expect(msg.data[1].value).to.eq(card1.name);
    expect(msg.data[2].value).to.eq(card2.name);
    expect(msg.data[3].value).to.eq(card3.name);
    expect(msg.message).to.eq('${0} drew ${1}, ${2} and ${3}');
  });

  it('logs drawn cards by card name', function() {
    const player1 = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const card1 = new Algae();
    const card2 = new Ants();
    const card3 = new Birds();
    const game = Game.newInstance('foobar', [player1, player2], player1);
    LogHelper.logDrawnCards(player1, []);
    let msg = game.gameLog.pop();
    expect(msg!.message).to.eq('${0} drew no cards');
    LogHelper.logDrawnCards(player1, [card1.name]);
    msg = game.gameLog.pop()!;
    expect(msg.data.length).to.eq(2);
    expect(msg.data[0].value).to.eq(player1.color);
    expect(msg.data[1].value).to.eq(card1.name);
    expect(msg.message).to.eq('${0} drew ${1}');
    LogHelper.logDrawnCards(player1, [card1.name, card2.name]);
    msg = game.gameLog.pop()!;
    expect(msg.data.length).to.eq(3);
    expect(msg.data[0].value).to.eq(player1.color);
    expect(msg.data[1].value).to.eq(card1.name);
    expect(msg.data[2].value).to.eq(card2.name);
    expect(msg.message).to.eq('${0} drew ${1} and ${2}');
    LogHelper.logDrawnCards(player1, [card1.name, card2.name, card3.name]);
    msg = game.gameLog.pop()!;
    expect(msg.data.length).to.eq(4);
    expect(msg.data[0].value).to.eq(player1.color);
    expect(msg.data[1].value).to.eq(card1.name);
    expect(msg.data[2].value).to.eq(card2.name);
    expect(msg.data[3].value).to.eq(card3.name);
    expect(msg.message).to.eq('${0} drew ${1}, ${2} and ${3}');
  });

  it('logs drawn cards privately', function() {
    const player1 = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const card1 = new Algae();
    const game = Game.newInstance('foobar', [player1, player2], player1);
    LogHelper.logDrawnCards(player1, [card1.name], true);
    const msg = game.gameLog.pop()!;
    expect(msg.data.length).to.eq(2);
    expect(msg.data[0].value).to.eq('You');
    expect(msg.data[1].value).to.eq(card1.name);
    expect(msg.message).to.eq('${0} drew ${1}');
  });
});
