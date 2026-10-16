using System;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class Feedback
    {
        [Key]
        public int FeedbackId { get; set; }

        [Range(1, int.MaxValue,
            ErrorMessage = "UserId is required and must be greater than 0.")]
        public int UserId { get; set; }

        public User? User { get; set; }

        [Required(ErrorMessage = "Feedback text is required.")]
        [MaxLength(500, ErrorMessage = "Feedback text cannot exceed 500 characters.")]
        public string FeedbackText { get; set; }

        public DateTime Date { get; set; }
    }
}