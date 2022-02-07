import {expect} from 'chai';
import {ControlledBloom} from '../../../src/cards/pathfinders/ControlledBloom';
import {Game} from '../../../src/Game';
import {ICard} from '../../../src/cards/ICard';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {TestingUtils} from '../../TestingUtils';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {ResourceType} from '../../../src/common/ResourceType';

describe('ControlledBloom', function() {
  let card: ControlledBloom;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ControlledBloom();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    TestingUtils.addOcean(player);
    expect(player.canPlay(card)).is.false;
    TestingUtils.addOcean(player);
    expect(player.canPlay(card)).is.false;
    TestingUtils.addOcean(player);
    expect(player.canPlay(card)).is.true;
  });

  it('play', function() {
    const a = TestingUtils.fakeCard({name: 'A' as CardName, resourceType: ResourceType.MICROBE});
    const b = TestingUtils.fakeCard({name: 'B' as CardName, resourceType: ResourceType.DATA});
    const c = TestingUtils.fakeCard({name: 'C' as CardName, resourceType: ResourceType.MICROBE});
    player.playedCards = [a, b, c];

    card.play(player);

    expect(player.plants).eq(3);

    const action = game.deferredActions.pop()!.execute()!;
    expect(action).is.instanceOf(SelectCard);
    const addResourcesToCard = action as SelectCard<ICard>;
    expect(addResourcesToCard.cards.map((c) => c.name)).has.members(['A', 'C']);
    addResourcesToCard.cb([a]);
    expect(a.resourceCount).eq(3);
  });
});
