import {expect} from 'chai';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {HousePrinting} from '../../../src/server/cards/prelude/HousePrinting';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {UnexpectedApplication} from '../../../src/server/cards/prelude2/UnexpectedApplication';

describe('UnexpectedApplication', function() {
  let card: UnexpectedApplication;
  let game: IGame;
  let player: TestPlayer;
  let tardigrades: IProjectCard;
  let housePrinting: IProjectCard;

  beforeEach(() => {
    card = new UnexpectedApplication();
    [game, player] = testGame(2);
    player.cardsInHand.push(card);
    tardigrades = new Tardigrades();
    housePrinting = new HousePrinting();
  });

  it('Should play', function() {
    player.cardsInHand.push(housePrinting, tardigrades);
    expect(card.canPlay(player)).is.true;

    player.playCard(card);
    const discardCard = cast(game.deferredActions.pop()!.execute(), SelectCard<IProjectCard>);

    // No SponsoredAcademies itself suggested to discard
    expect(discardCard.cards.filter((c) => c.name === card.name)).has.lengthOf(0);

    discardCard.cb([housePrinting]);
    runAllActions(game); // Draw cards
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
