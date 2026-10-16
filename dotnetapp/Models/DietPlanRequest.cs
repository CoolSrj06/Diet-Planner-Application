using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class DietPlanRequest
    {
        [Key]
        public int DietPlanRequestId { get; set; }

        [Required(ErrorMessage = "User Id is required.")]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

        [Required(ErrorMessage = "Diet Plan Id is required.")]
        [ForeignKey("DietPlan")]
        public int DietPlanId { get; set; }

        public DietPlan? DietPlan { get; set; }

        [Required(ErrorMessage = "Age is required.")]
        [Range(1, 120, ErrorMessage = "Age must be between 1 and 120.")]
        public int Age { get; set; }

        [Required(ErrorMessage = "Weight is required.")]
        [Range(1, 500, ErrorMessage = "Weight must be greater than 0.")]
        public double Weight { get; set; }

        [Required(ErrorMessage = "Height is required.")]
        [Range(1, 300, ErrorMessage = "Height must be greater than 0.")]
        public double Height { get; set; }

        [Required(ErrorMessage = "Gender is required.")]
        [MaxLength(20, ErrorMessage = "Gender cannot exceed 20 characters.")]
        public string Gender { get; set; }

        [Required(ErrorMessage = "Activity Level is required.")]
        [MaxLength(50, ErrorMessage = "Activity Level cannot exceed 50 characters.")]
        public string ActivityLevel { get; set; }

        [Required(ErrorMessage = "Goal is required.")]
        [MaxLength(100, ErrorMessage = "Goal cannot exceed 100 characters.")]
        public string Goal { get; set; }

        [Required(ErrorMessage = "Medical Conditions field is required.")]
        [MaxLength(500, ErrorMessage = "Medical Conditions cannot exceed 500 characters.")]
        public string MedicalConditions { get; set; }

        public DateTime CreatedAt { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [MaxLength(20, ErrorMessage = "Status cannot exceed 20 characters.")]
        public string Status { get; set; }
    }
}