import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {TitanFloatingLaunchPad} from '../../../src/server/cards/colonies/TitanFloatingLaunchPad';
import {TitanShuttles} from '../../../src/server/cards/colonies/TitanShuttles';
import {ICard} from '../../../src/server/cards/ICard';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('TitanShuttles', () => {
  let card: TitanShuttles;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new TitanShuttles();
    [game, player] = testGame(2);

    player.playedCards.push(card);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Can act', () => {
    expect(card.canAct()).is.true;
  });

  it('Gives VP', () => {
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Auto add floaters if only 1 option and 1 target available', () => {
    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(card.resourceCount).to.eq(2);
  });

  it('Can select target if multiple Jovian floater cards available', () => {
    const card2 = new TitanFloatingLaunchPad();
    player.playedCards.push(card2);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);

    const selectCard = cast(game.deferredActions.peek()!.execute(), SelectCard<ICard>);
    selectCard.cb([card]);
    expect(card.resourceCount).to.eq(2);
  });

  it('Both actions available', () => {
    const card2 = new TitanFloatingLaunchPad();
    player.playedCards.push(card2);
    player.addResourceTo(card, 7);

    const orOptions = cast(card.action(player), OrOptions);
    expect(orOptions.options).has.lengthOf(2);

    // spend floaters to gain titanium
    orOptions.options[1].cb(6);
    expect(card.resourceCount).to.eq(1);
    expect(player.titanium).to.eq(6);

    // add 2 floaters to Jovian card
    orOptions.options[0].cb();
    expect(game.deferredActions).has.lengthOf(1);

    const selectCard = cast(game.deferredActions.peek()!.execute(), SelectCard<ICard>);
    selectCard.cb([card2]);
    expect(card2.resourceCount).to.eq(2);
  });
});
