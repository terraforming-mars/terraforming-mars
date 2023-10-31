import {expect} from 'chai';
import {IPlayer} from '../../../src/server/IPlayer';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {DeferredAction} from '../../../src/server//deferredActions/DeferredAction';
import {SendDelegateToArea} from '../../../src/server//deferredActions/SendDelegateToArea';
import {SelectParty} from '../../../src/server//inputs/SelectParty';
import {cast} from '../../TestingUtils';
import {PlaceCityTile} from '../../../src/server/deferredActions/PlaceCityTile';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

export function assertSendDelegateToArea(player: IPlayer, action: DeferredAction) {
  const sendDelegate = cast(action, SendDelegateToArea);

  const game = player.game;
  const turmoil = game.turmoil!;
  const marsFirst = turmoil.getPartyByName(PartyName.MARS);

  const delegatesInReserve = turmoil.getAvailableDelegateCount(player);
  const delegatesInParty = marsFirst.delegates.get(player);

  const options = cast(sendDelegate.execute(), SelectParty);
  options.cb(marsFirst.name);

  expect(turmoil.getAvailableDelegateCount(player)).eq(delegatesInReserve - 1);
  expect(marsFirst.delegates.get(player)).eq(delegatesInParty + 1);
}

export function assertPlaceCityTile(player: IPlayer, action: DeferredAction) {
  const placeCityTile = cast(action, PlaceCityTile);
  const selectSpace = cast(placeCityTile.execute(), SelectSpace);
  const space = selectSpace.spaces[0];
  expect(space.tile).is.undefined;

  selectSpace.cb(space);

  expect(space.tile?.tileType).eq(TileType.CITY);
  expect(space.player?.id).eq(player.id);
}
