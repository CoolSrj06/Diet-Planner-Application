using System;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class DietPlan
    {
        [Key]
        public int DietPlanId { get; set; }

        [Required(ErrorMessage = "Plan Name is required.")]
        [MaxLength(30, ErrorMessage = "Plan Name cannot exceed 30 characters.")]
        public string PlanName { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Duration is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Duration must be greater than 0.")]
        public int Duration { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}