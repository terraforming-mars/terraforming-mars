import {expect} from 'chai';
import {testGame} from '../TestGame';
import {RemoveResourcesFromCard, Response} from '../../src/server/deferredActions/RemoveResourcesFromCard';
import {CardResource} from '../../src/common/CardResource';
import {AtmoCollectors} from '../../src/server/cards/colonies/AtmoCollectors';
import {cast} from '../TestingUtils';

// This requires a lot more tests
describe('RemoveResourcesFromCard', () => {
  let response: Response;
  const andThen = (c: Response) => {
    response = c;
  };

  beforeEach(() => {
    response = undefined as unknown as Response;
  });

  it('simple', () => {
    const [/* game */, player] = testGame(3);
    const action = new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, {source: 'self', blockable: false}).andThen(andThen);
    cast(action.execute(), undefined);

    expect(response).deep.eq({card: undefined, owner: undefined, proceed: false});
  });

  it('remove from self', () => {
    const [/* game */, player] = testGame(3);
    const atmoCollectors = new AtmoCollectors();
    player.playedCards.push(atmoCollectors);
    atmoCollectors.resourceCount = 2;
    const action = new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, {source: 'self', blockable: false}).andThen(andThen);
    cast(action.execute(), undefined);

    expect(response).deep.eq({card: atmoCollectors, owner: player, proceed: true});
    expect(atmoCollectors.resourceCount).eq(1);
  });

  it('cannot block mandatory self-removals', () => {
    const [/* game */, player] = testGame(3, {underworldExpansion: true});
    const atmoCollectors = new AtmoCollectors();
    player.playedCards.push(atmoCollectors);
    player.underworldData.corruption = 1;
    atmoCollectors.resourceCount = 2;
    const action = new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, {source: 'self', blockable: false}).andThen(andThen);
    cast(action.execute(), undefined);

    expect(response).deep.eq({card: atmoCollectors, owner: player, proceed: true});
    expect(atmoCollectors.resourceCount).eq(1);
  });
});
