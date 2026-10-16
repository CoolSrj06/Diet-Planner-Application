export interface DietPlanRequest {
    DietPlanRequestId? : number;
    UserId? : number;
    DietPlanId? : number;
    Age : number;
    Weight : number;
    Height : number;
    Gender : string;
    ActivityLevel : string;
    Goal : string;
    MedicalConditions : string;
    CreatedAt : string;
    Status : string;
}