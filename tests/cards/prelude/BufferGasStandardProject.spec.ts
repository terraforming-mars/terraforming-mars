import {expect} from 'chai';
import {BufferGasStandardProject} from '../../../src/server/cards/prelude/BufferGasStandardProject';
import {runAllActions, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {Payment} from '../../../src/common/inputs/Payment';
import {SelectStandardProjectToPlay} from '../../../src/server/inputs/SelectStandardProjectToPlay';
import {StandardTechnology} from '../../../src/server/cards/base/StandardTechnology';

describe('BufferGasStandardProject', () => {
  let card: BufferGasStandardProject;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new BufferGasStandardProject();
    [game, player] = testGame(1);
  });

  it('Can act', () => {
    player.megaCredits = card.cost - 1;
    expect(card.canAct(player)).is.false;
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.megaCredits = card.cost;
    player.setTerraformRating(20);

    card.payAndExecute(player, Payment.of({megacredits: card.cost}));
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(player.terraformRating).eq(21);
  });

  it('Test reds', () => {
    [game, player] = testGame(1, {turmoilExtension: true});
    testRedsCosts(() => card.canAct(player), player, card.cost, 3);
  });

  it('maxRepetitions', () => {
    player.megaCredits = card.cost * 3 + 15;
    expect(card.maxRepetitions(player)).eq(3);
  });

  it('is offered with maxRepetitions to the client', () => {
    player.megaCredits = card.cost * 2;
    const model = new SelectStandardProjectToPlay(player, [card]).toModel(player);
    expect(model.cards[0].maxRepetitions).eq(2);
  });

  it('can be played multiple times at once', () => {
    player.megaCredits = card.cost * 3 + 5;
    player.setTerraformRating(20);
    const selectProject = new SelectStandardProjectToPlay(player, [card]);

    selectProject.process({type: 'projectCard', card: card.name, payment: Payment.of({megacredits: card.cost * 3}), amount: 3});
    runAllActions(game);

    expect(player.megaCredits).eq(5);
    expect(player.terraformRating).eq(23);
  });

  it('without amount it is played once', () => {
    player.megaCredits = card.cost * 3;
    player.setTerraformRating(20);
    const selectProject = new SelectStandardProjectToPlay(player, [card]);

    selectProject.process({type: 'projectCard', card: card.name, payment: Payment.of({megacredits: card.cost})});
    runAllActions(game);

    expect(player.megaCredits).eq(card.cost * 2);
    expect(player.terraformRating).eq(21);
  });

  it('rejects invalid amounts and underpayment', () => {
    player.megaCredits = card.cost * 2;
    const selectProject = new SelectStandardProjectToPlay(player, [card]);

    expect(() => selectProject.process({type: 'projectCard', card: card.name, payment: Payment.of({megacredits: card.cost * 2}), amount: 3}))
      .to.throw(/Invalid amount/);
    expect(() => selectProject.process({type: 'projectCard', card: card.name, payment: Payment.of({megacredits: card.cost}), amount: 0}))
      .to.throw(/Invalid amount/);
    expect(() => selectProject.process({type: 'projectCard', card: card.name, payment: Payment.of({megacredits: card.cost}), amount: 2}))
      .to.throw(/Did not spend enough/);
  });

  it('each repetition triggers standard project effects', () => {
    player.playedCards.push(new StandardTechnology());
    player.megaCredits = card.cost * 2;
    const selectProject = new SelectStandardProjectToPlay(player, [card]);

    selectProject.process({type: 'projectCard', card: card.name, payment: Payment.of({megacredits: card.cost * 2}), amount: 2});
    runAllActions(game);

    // Standard Technology gives 3 M€ per standard project.
    expect(player.megaCredits).eq(6);
  });
});
