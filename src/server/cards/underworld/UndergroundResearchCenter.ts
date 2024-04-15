import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {ALL_TAGS, Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Units} from '../../../common/Units';
import {inplaceRemove} from '../../../common/utils/utils';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Priority} from '../../deferredActions/Priority';

export class UndergroundResearchCenter extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.UNDERGROUND_RESEARCH_CENTER,
      tags: [Tag.BUILDING],
      cost: 18,

      requirements: {excavation: 5},

      metadata: {
        cardNumber: 'U62',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1)).excavate().cards(2).asterix();
        }),

        description: 'Requires 5 excavation markers. Decrease your energy production 1 step. ' +
        'Excavate an underground resource. Choose a tag that is not the wild tag or clone tag. ' +
        'Draw 2 cards with that tag.',
      },
    });
  }

  private excavatableSpacesWithEnergyProduction(player: IPlayer) {
    return UnderworldExpansion.excavatableSpaces(player).filter(
      (space) => space.undergroundResources === 'energy1production');
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (player.production.energy > 0) {
      return true;
    }
    if (this.excavatableSpacesWithEnergyProduction(player).length > 0) {
      this.warnings.add('underworldMustExcavateEnergy');
      return true;
    }
    return false;
  }

  private chooseTagsAndDraw(player: IPlayer) {
    const tags = [...ALL_TAGS];
    inplaceRemove(tags, Tag.WILD);
    inplaceRemove(tags, Tag.CLONE);

    const options = tags.map((tag) => {
      return new SelectOption(tag).andThen(() => {
        player.drawCard(2, {tag: tag});
        return undefined;
      });
    });
    return new OrOptions(...options);
  }

  public override bespokePlay(player: IPlayer) {
    const spaces = player.production.energy > 0 ?
      UnderworldExpansion.excavatableSpaces(player) :
      this.excavatableSpacesWithEnergyProduction(player);

    return new SelectSpace('Select space to excavate', spaces)
      .andThen((space) => {
        UnderworldExpansion.excavate(player, space);
        // Energy production is granted immediately, so in case this player can only do this because there's energy production on the board, it's now theirs.
        player.production.adjust(Units.of({energy: -1}));
        player.defer(this.chooseTagsAndDraw(player), Priority.DRAW_CARDS);
        return undefined;
      });
  }
}
