import {expect} from 'chai';
import {PalladinShipping} from '@/server/cards/prelude2/PalladinShipping';
import {CardName} from '@/common/cards/CardName';
import {newCard} from '@/server/createCard';
import {IGame} from '@/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions, setTemperature} from '../../TestingUtils';

describe('PalladinShipping', () => {
  let card: PalladinShipping;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new PalladinShipping();
    [game, player] = testGame(2);
  });

  it('play', () => {
    player.playCorporationCard(card);
    expect(player.megaCredits).to.eq(36);
    expect(player.stock.titanium).to.eq(5);
  });

  it('canAct', () => {
    player.stock.titanium = 1;
    expect(card.canAct(player)).is.false;

    player.stock.titanium = 2;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.stock.titanium = 2;
    setTemperature(game, 4);

    card.action(player);
    runAllActions(game);

    expect(player.stock.titanium).to.eq(0);
    expect(game.getTemperature()).to.eq(6);
  });

  for (const run of [
    {cardName: CardName.ASTEROID, expected: 1}, // EVENT with the SPACE tag
    {cardName: CardName.MINING_COLONY, expected: 0}, // SPACE-tagged, but not an EVENT
    {cardName: CardName.PUBLIC_PLANS, expected: 0}, // EVENT, but no SPACE tag
    {cardName: CardName.SF_MEMORIAL, expected: 0}, // neither EVENT nor SPACE-tagged
  ] as const) {
    it('onCardPlayed ' + JSON.stringify(run), () => {
      const playedCard = newCard(run.cardName);
      card.onCardPlayed(player, playedCard);
      expect(player.stock.titanium).to.eq(run.expected);
    });
  }
});
