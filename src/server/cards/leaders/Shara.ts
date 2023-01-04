import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { Player } from '../../Player';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';
import {played} from '../Options';
import {Tag} from '../../../common/cards/Tag';
import { multiplier } from '../Options';
import {DeclareCloneTag} from '../../pathfinders/DeclareCloneTag';
import {ICloneTagCard} from '../pathfinders/ICloneTagCard';
import { Resources } from '../../../common/Resources';
import {PathfindersData} from '../../pathfinders/PathfindersData';
import {PlanetaryTag} from '../../pathfinders/PathfindersExpansion';

import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';

export class Shara extends Card implements LeaderCard, ICloneTagCard {
  constructor() {
    super({
      name: CardName.SHARA,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'LXXX',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY').br;
          b.planetaryTrack().text('2').clone(1, {played}).br;
          b.megacredits(0, {multiplier}).asterix();
        }),
        description: 'Once per game, choose a planet tag. This card counts as having played 2 of that tag. Then gain M€ equal to that tags Pathfinder Track.',
      },
    });
  }

  public cloneTag: Tag = Tag.CLONE;

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public override get tags(): Array<Tag> {
    return [this.cloneTag, this.cloneTag];
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const data = player.game.pathfindersData;
    if (data === undefined) {
      return undefined;
    }

    player.game.defer(
      new DeclareCloneTag(
        player,
        this,
      )
    );
    this.isDisabled = true;
    player.game.defer(new SimpleDeferredAction(
      player,
      () => {
        new DeclareCloneTag(player,this);
        const planetTag = this.cloneTag as PlanetaryTag;
        const value = PathfindersData.getValue(data, planetTag);
        player.addResource(Resources.MEGACREDITS, value, {log: true});    
        return undefined;
      }
    ));
    return undefined;
  }
}
