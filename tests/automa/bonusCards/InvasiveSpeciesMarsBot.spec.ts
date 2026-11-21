import {expect} from 'chai';
import {InvasiveSpeciesMarsBot} from '@/server/automa/bonusCards/InvasiveSpeciesMarsBot';
import {Ants} from '@/server/cards/base/Ants';
import {Birds} from '@/server/cards/base/Birds';
import {Fish} from '@/server/cards/base/Fish';
import {Mine} from '@/server/cards/base/Mine';
import {Pets} from '@/server/cards/base/Pets';
import {ProtectedHabitats} from '@/server/cards/base/ProtectedHabitats';
import {Tardigrades} from '@/server/cards/base/Tardigrades';
import {Titan} from '@/server/colonies/Titan';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('InvasiveSpeciesMarsBot', () => {
  for (const run of [
    {options: {}, titan: false, expected: ['gainMc(5)']},
    {options: {venusNextExtension: true}, titan: false, expected: ['gainMc(2)', 'addFloaters(1)']},
    {options: {coloniesExtension: true}, titan: true, expected: ['gainMc(2)', 'addFloaters(1)']},
    {options: {coloniesExtension: true}, titan: false, expected: ['gainMc(2)']},
  ] as const) {
    it('gains 5 M€, or 2 M€ and a floater with Venus Next or Titan: ' + JSON.stringify(run), () => {
      const [game, human] = testGame(1, run.options);
      const {marsBot, calls} = recordingMarsBot({game, humanPlayer: human});
      game.colonies = run.titan ? [new Titan()] : [];

      new InvasiveSpeciesMarsBot().resolve(marsBot);

      expect(calls).deep.eq(run.expected);
    });
  }

  it('removes the resource worth the most VP, not the card scoring the most', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
    const ants = new Ants();
    ants.resourceCount = 4;
    const birds = new Birds();
    birds.resourceCount = 1;
    human.playedCards.push(ants, birds);

    new InvasiveSpeciesMarsBot().resolve(marsBot);

    expect(ants.resourceCount).eq(4);
    expect(birds.resourceCount).eq(0);
  });

  it('skips Pets, whose animals cannot be removed', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
    const pets = new Pets();
    pets.resourceCount = 6;
    const tardigrades = new Tardigrades();
    tardigrades.resourceCount = 4;
    human.playedCards.push(pets, tardigrades);

    new InvasiveSpeciesMarsBot().resolve(marsBot);

    expect(pets.resourceCount).eq(6);
    expect(tardigrades.resourceCount).eq(3);
  });

  it('breaks a tie by flipping a project card', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
    const birds = new Birds();
    birds.resourceCount = 1;
    const fish = new Fish();
    fish.resourceCount = 1;
    human.playedCards.push(birds, fish);
    // Cost 4 counts to the 2nd of 2
    game.projectDeck.drawPile.push(new Mine());

    new InvasiveSpeciesMarsBot().resolve(marsBot);

    expect(birds.resourceCount).eq(1);
    expect(fish.resourceCount).eq(0);
  });

  it('removes nothing from a player with Protected Habitats', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
    const birds = new Birds();
    birds.resourceCount = 1;
    human.playedCards.push(new ProtectedHabitats(), birds);

    new InvasiveSpeciesMarsBot().resolve(marsBot);

    expect(birds.resourceCount).eq(1);
  });
});
