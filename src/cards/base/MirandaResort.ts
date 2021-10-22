import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class MirandaResort extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MIRANDA_RESORT,
      tags: [Tags.JOVIAN, Tags.SPACE],
      cost: 12,
      victoryPoints: 1,

      metadata: {
        cardNumber: '051',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().earth(1, {played});
          });
        }),
        description: 'Increase your M€ production 1 step for each Earth tag you have.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH), {log: true});
    return undefined;
  }
}
