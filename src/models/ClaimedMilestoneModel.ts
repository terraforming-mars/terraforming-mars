import { IMilestone } from "../milestones/IMilestone";

export interface ClaimedMilestoneModel {
    milestone: IMilestone;
    player: string;
}
