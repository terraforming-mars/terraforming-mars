import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../../cards/IProjectCard';
import {Resource} from '../../../common/Resource';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Tag} from '../../../common/cards/Tag';
import {Units} from '../../../common/Units';
import {UndergroundResourceToken} from '../../../common/underworld/UndergroundResourceToken';

export class Deepmining extends Card implements IProjectCard {
  public readonly title = 'Select an identified space with a steel or titanium bonus';
  public bonusResource?: Array<Resource>;

  constructor() {
    super({
      name: CardName.DEEPMINING,
      cost: 11,
      type: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      metadata: {
        cardNumber: 'U29',
        renderData: CardRenderer.builder((b) => {
          b.excavate(1).asterix().br;
          b.production((pb) => pb.steel(1).or().titanium(1)).asterix();
        }),
        description: 'Excavate an underground resource that depicts steel or titanium ANYWHERE ON THE BOARD. ' +
          'Increase your production of that resource 1 step.',
      },
    });
  }

  steelTokens: ReadonlyArray<UndergroundResourceToken> = [
    'steel1production',
    'steel2',
    'steel2pertemp',
  ] as const;
  titaniumTokens: ReadonlyArray<UndergroundResourceToken> = [
    'titanium1pertemp',
    'titanium1production',
    'titanium2',
    'titaniumandplant',
  ] as const;

  public override bespokeCanPlay(player: IPlayer): boolean {
    return this.getAvailableSpaces(player).length > 0;
  }

  public getAvailableSpaces(player: IPlayer): ReadonlyArray<Space> {
    return UnderworldExpansion.identifiedSpaces(player.game).filter((space) => {
      if (space.excavator !== undefined) {
        return false;
      }
      if (space.undergroundResources === undefined) {
        return false;
      }
      if (this.steelTokens.includes(space.undergroundResources)) {
        return true;
      }
      if (this.titaniumTokens.includes(space.undergroundResources)) {
        return true;
      }
      return false;
    });
  }

  public override bespokePlay(player: IPlayer): SelectSpace {
    return new SelectSpace(this.title, this.getAvailableSpaces(player))
      .andThen((space) => {
        this.spaceSelected(player, space);
        return undefined;
      });
  }

  public productionBox() {
    // TODO(kberg): Matches Specialzied Settlement and MiningCard
    const units = {...Units.EMPTY};
    if (this.bonusResource && this.bonusResource.length === 1) {
      units[this.bonusResource[0]] += 1;
    }
    return units;
  }

  protected spaceSelected(player: IPlayer, space: Space) {
    UnderworldExpansion.excavate(player, space);
    const token = space.undergroundResources;
    if (token === undefined) {
      throw new Error('unexpected failed deep mining');
    }
    const resource = this.steelTokens.includes(token) ? Resource.STEEL : Resource.TITANIUM;
    player.production.add(resource, 1, {log: true});
    this.bonusResource = [resource];
  }
}
