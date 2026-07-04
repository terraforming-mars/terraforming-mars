import {expect} from 'chai';
import {Aerotech} from '../../../src/server/cards/community/Aerotech';
import {CardName} from '../../../src/common/cards/CardName';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {Phase} from '../../../src/common/Phase';
import {newProjectCard} from '../../../src/server/createCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Aerotech', () => {
  let card: Aerotech;
  let player: TestPlayer;
  let drawnCards: ReadonlyArray<IProjectCard>;
  let discardedCards: ReadonlyArray<IProjectCard>;

  beforeEach(() => {
    card = new Aerotech();
    [, player] = testGame(1);
    player.playedCards.push(card);
    drawnCards = [newProjectCard(CardName.AQUIFER_PUMPING)!, newProjectCard(CardName.IO_MINING_INDUSTRIES)!];
    discardedCards = [newProjectCard(CardName.AQUIFER_PUMPING)!];
  });

  it('gains 1 titanium per discarded card during the research phase', () => {
    player.game.phase = Phase.RESEARCH;

    Aerotech.onDrawCards(player, drawnCards, discardedCards);

    expect(player.titanium).to.eq(discardedCards.length);
  });

  it('gains no titanium when nothing is discarded', () => {
    player.game.phase = Phase.RESEARCH;

    Aerotech.onDrawCards(player, drawnCards, []);

    expect(player.titanium).to.eq(0);
  });

  it('does nothing outside the research phase', () => {
    player.game.phase = Phase.ACTION;

    Aerotech.onDrawCards(player, drawnCards, discardedCards);

    expect(player.titanium).to.eq(0);
  });

  it('does nothing when the player is not playing Aerotech', () => {
    player.playedCards.remove(card);
    player.game.phase = Phase.RESEARCH;

    Aerotech.onDrawCards(player, drawnCards, discardedCards);

    expect(player.titanium).to.eq(0);
  });
});
