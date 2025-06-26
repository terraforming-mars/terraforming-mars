import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Fish} from '../../../src/server/cards/base/Fish';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {EcologyResearch} from '../../../src/server/cards/colonies/EcologyResearch';
import {ICard} from '../../../src/server/cards/ICard';
import {Luna} from '../../../src/server/colonies/Luna';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('EcologyResearch', () => {
  let card: EcologyResearch;
  let player: TestPlayer;
  let game: IGame;
  let colony: Luna;

  beforeEach(() => {
    card = new EcologyResearch();
    [game, player/* , player2 */] = testGame(2, {coloniesExtension: true});
  });

  it('Should play without targets', () => {
    colony = new Luna();
    colony.colonies.push(player.id);
    player.game.colonies.push(colony);
    colony.colonies.push(player.id);
    cast(card.play(player), undefined);
    expect(player.production.plants).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Should play with single targets', () => {
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
  });

  it('Should play with multiple targets', () => {
    const tardigrades = new Tardigrades();
    const ants = new Ants();
    player.playedCards.push(tardigrades, ants);

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    // add two microbes to Ants
    const selectCard = cast(game.deferredActions.peek()!.execute(), SelectCard<ICard>);
    selectCard.cb([ants]);

    expect(ants.resourceCount).to.eq(2);
  });
});
