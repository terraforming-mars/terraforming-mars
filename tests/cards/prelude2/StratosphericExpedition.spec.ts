import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {StratosphericExpedition} from '../../../src/server/cards/prelude2/StratosphericExpedition';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {Tag} from '../../../src/common/cards/Tag';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';

describe('StratosphericExpedition', () => {
  let card: StratosphericExpedition;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new StratosphericExpedition();
    [game, player] = testGame(1, {venusNextExtension: true});
  });

  it('Should play', () => {
    const jovianLanterns = new JovianLanterns();
    const searchForLife = new SearchForLife();
    player.playedCards = [jovianLanterns, searchForLife];
    const action = card.play(player);

    runAllActions(game);

    cast(action, undefined);

    expect(player.cardsInHand).has.lengthOf(2);
    expect(jovianLanterns.resourceCount).eq(2);
    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tag.VENUS)).not.to.eq(-1));
  });
});
