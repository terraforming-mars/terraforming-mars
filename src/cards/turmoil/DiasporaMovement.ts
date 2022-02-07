import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {PartyName} from '../../common/turmoil/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';

export class DiasporaMovement extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DIASPORA_MOVEMENT,
      tags: [Tags.JOVIAN],
      cost: 7,
      requirements: CardRequirements.builder((b) => b.party(PartyName.REDS)),
      victoryPoints: 1,

      metadata: {
        cardNumber: 'TO4',
        description: 'Requires that Reds are ruling or that you have 2 delegates there. Gain 1M€ for each Jovian tag in play, including this.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().jovian({played, all});
        }),
      },
    });
  }

  public play(player: Player) {
    const amount = player.game.getPlayers()
      .map((p) => p.getTagCount(Tags.JOVIAN, p.id === player.id ? 'default' : 'raw'))
      .reduce((a, c) => a + c);
    player.addResource(Resources.MEGACREDITS, amount + 1, {log: true});
    return undefined;
  }
}
