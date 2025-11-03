import { type AchievementId } from "./Types";
export interface Achievement {
    ID: AchievementId;
    Icon?: string;
    Name?: string;
    Description?: string;
    Secret?: boolean;
    NotInSteam?: boolean;
    Condition: () => boolean;
    Visible?: () => boolean;
    AdditionalUnlock?: AchievementId[];
}
export interface PlayerAchievement {
    ID: AchievementId;
    unlockedOn?: number;
}
export interface AchievementDataJson {
    achievements: Record<AchievementId, AchievementData>;
}
export interface AchievementData {
    ID: AchievementId;
    Name: string;
    Description: string;
}
export declare const achievements: Record<AchievementId, Achievement>;
export declare function calculateAchievements(): void;
