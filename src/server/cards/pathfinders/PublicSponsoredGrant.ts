import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../../common/turmoil/PartyName';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {all} from '../Options';

export class PublicSponsoredGrant extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.PUBLIC_SPONSORED_GRANT,
      cost: 6,
      requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),

      metadata: {
        cardNumber: 'PfTVD',
        renderData: CardRenderer.builder((b) => {
          b.minus().megacredits(2, {all}).br;
          b.cards(1, {secondaryTag: Tag.WILD}).cards(1, {secondaryTag: Tag.WILD}).asterix();
        }),
        description: 'Requires Scientists are ruling or that you have 2 delegates there. All players lose 2M€. Choose a tag (NOT CITY, ? OR PLANETARY TRACK) and draw 2 cards with that tag.',
      },
    });
  }

  private draw2Cards(player: Player, tag: Tag) {
    player.drawCard(2, {tag: tag});
  }

  public override bespokePlay(player: Player) {
    player.game.getPlayers().forEach((p) => p.deductResource(Resources.MEGACREDITS, Math.min(p.megaCredits, 2), {log: true, from: player}));

    // TODO(kberg): Add a test that fails when a new tag is added.
    const tags = [
      Tag.BUILDING,
      Tag.SPACE,
      Tag.SCIENCE,
      Tag.POWER,
      Tag.PLANT,
      Tag.MICROBE,
      Tag.ANIMAL];

    const options = tags.map((tag) => {
      return new SelectOption(tag, undefined, () => {
        this.draw2Cards(player, tag);
        return undefined;
      });
    });

    return new OrOptions(...options);
  }
}
