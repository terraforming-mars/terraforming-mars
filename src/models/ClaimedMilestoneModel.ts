import { IMilestone } from "../milestones/IMilestone";

export interface ClaimedMilestoneModel {
    milestone: IMilestone;
    player_name: string;
    player_color: string;
}
