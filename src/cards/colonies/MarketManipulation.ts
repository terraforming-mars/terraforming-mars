import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Card} from '../Card';
import {Size} from '../../common/cards/render/Size';
import {CardRenderer} from '../render/CardRenderer';
import {COLONY_DESCRIPTIONS} from '../../common/colonies/ColonyDescription';

export class MarketManipulation extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 1,
      tags: [Tags.EARTH],
      name: CardName.MARKET_MANIPULATION,
      cardType: CardType.EVENT,

      metadata: {
        cardNumber: 'C23',
        renderData: CardRenderer.builder((b) => {
          b.text('Increase one colony tile track 1 step. Decrease another colony tile track 1 step.', Size.SMALL, true);
        }),
      },
    });
  }

  public override canPlay(player: Player): boolean {
    const increasableColonies = this.getIncreasableColonies(player.game);
    const decreasableColonies = this.getDecreasableColonies(player.game);

    if (increasableColonies.length === 0) return false;
    if (decreasableColonies.length === 0) return false;
    if (increasableColonies.length === 1 && decreasableColonies.length === 1 && increasableColonies[0] === decreasableColonies[0]) {
      return false;
    }

    return true;
  }

  private getIncreasableColonies(game: Game) {
    return game.colonies.filter((colony) => colony.trackPosition < 6 && colony.isActive);
  }

  private getDecreasableColonies(game: Game) {
    return game.colonies.filter((colony) => colony.trackPosition > colony.colonies.length && colony.isActive);
  }

  public play(player: Player) {
    const selectColonies = new OrOptions();
    selectColonies.title = 'Select colonies to increase and decrease tile track';

    const increasableColonies = this.getIncreasableColonies(player.game);
    const decreasableColonies = this.getDecreasableColonies(player.game);

    increasableColonies.forEach(function(c1) {
      decreasableColonies.forEach(function(c2) {
        if (c1.name !== c2.name) {
          const c1Description = COLONY_DESCRIPTIONS.get(c1.name) ?? 'unknown';
          const c2Description = COLONY_DESCRIPTIONS.get(c2.name) ?? 'unknown';
          const description = 'Increase ' + c1.name + ' (' + c1Description + ') and decrease ' + c2.name + ' (' + c2Description + ')';
          const colonySelect = new SelectOption(
            description,
            'Select',
            () => {
              c1.increaseTrack();
              c2.decreaseTrack();
              player.game.log('${0} increased ${1} track and decreased ${2} track', (b) => b.player(player).string(c1.name).string(c2.name));
              return undefined;
            },
          );

          selectColonies.options.push(colonySelect);
        }
      });
    });

    return selectColonies;
  }
}
