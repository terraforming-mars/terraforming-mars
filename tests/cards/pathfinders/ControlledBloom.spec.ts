import {expect} from 'chai';
import {ControlledBloom} from '../../../src/server/cards/pathfinders/ControlledBloom';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {addOcean, cast, fakeCard} from '../../TestingUtils';
import {toName} from '../../../src/common/utils/utils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {CardResource} from '../../../src/common/CardResource';

describe('ControlledBloom', () => {
  let card: ControlledBloom;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ControlledBloom();
    [game, player] = testGame(1);
  });

  it('canPlay', () => {
    player.megaCredits = card.cost;
    addOcean(player);
    expect(player.canPlay(card)).is.false;
    addOcean(player);
    expect(player.canPlay(card)).is.false;
    addOcean(player);
    expect(player.canPlay(card)).is.true;
  });

  it('play', () => {
    const a = fakeCard({name: 'A' as CardName, resourceType: CardResource.MICROBE});
    const b = fakeCard({name: 'B' as CardName, resourceType: CardResource.DATA});
    const c = fakeCard({name: 'C' as CardName, resourceType: CardResource.MICROBE});
    player.playedCards = [a, b, c];

    card.play(player);

    expect(player.plants).eq(3);

    const addResourcesToCard = cast(game.deferredActions.pop()!.execute()!, SelectCard);
    expect(addResourcesToCard.cards.map(toName)).has.members(['A', 'C']);
    addResourcesToCard.cb([a]);
    expect(a.resourceCount).eq(3);
  });
});
