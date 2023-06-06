import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {CardRequirements} from '../requirements/CardRequirements';
import {Tag} from '../../../common/cards/Tag';
import {all} from '../Options';

export class FundingForIter extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.FUNDING_FOR_ITER,
      cost: 15,
      tags: [Tag.POWER, Tag.EARTH],
      requirements: CardRequirements.builder((b) => b.tag(Tag.EARTH, 6, {all})),

      behavior: {
        production: {megacredits: 2, energy: 1, heat: 1,},
      },

      metadata: {
        cardNumber: 'N22',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(2).energy(2).heat(1)}).br;
          b.minus().megacredits(1, {all}).asterix();
        }),
        description: 'Requires any 6 Earth tags in play. Increase you M€ production 2 steps. Increase your energy production and your heat production 1 step each. ALL players remove 1 M€.',
      },
    });
  }
  
  public override bespokePlay(player: Player) {
    for (const p of player.game.getPlayers()) {
          p.deductResource(Resource.MEGACREDITS, 1, {log: true, from: player});
        }
        return undefined;
      }
    }
