using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FeedbackController : ControllerBase
    {
        private readonly FeedbackService _feedbackService;

        public FeedbackController(FeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        // Admin / Nutritionist can view all feedbacks
        [Authorize(Roles = "Admin,User")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllFeedbacks();
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Admin / Nutritionist and User can view feedbacks by user ID
        [Authorize(Roles = "Admin,User")]
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacksByUserId(
            int userId)
        {
            try
            {
                var feedbacks =
                    await _feedbackService.GetFeedbacksByUserId(userId);

                if (feedbacks == null || !feedbacks.Any())
                {
                    return NotFound("No feedbacks were found for this");
                }

                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Only User can add feedback
        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<ActionResult> AddFeedback(
            [FromBody] Feedback feedback)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                await _feedbackService.AddFeedback(feedback);

                return Ok("Feedback added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Only Admin / Nutritionist can delete feedback
        [Authorize(Roles = "User")]
        [HttpDelete("{feedbackId}")]
        public async Task<ActionResult> DeleteFeedback(int feedbackId)
        {
            try
            {
                var result =
                    await _feedbackService.DeleteFeedback(feedbackId);

                if (!result)
                {
                    return NotFound("Cannot find any feedback");
                }

                return Ok("Feedback deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        // Endpoint 1: Get User Name by User ID
        [Authorize(Roles = "Admin,User")]
        [HttpGet("username/{userId}")]
        public async Task<ActionResult<string>> GetUserNameByUserId(int userId)
        {
            try
            {
                var username = await _feedbackService.GetUserNameByUserId(userId);

                if (string.IsNullOrEmpty(username))
                {
                    return NotFound("User not found");
                }

                return Ok(new { username });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Endpoint 2: Get User Details by User ID
        [Authorize(Roles = "Admin,User")]
        [HttpGet("userdetails/{userId}")]
        public async Task<ActionResult<User>> GetUserDetailsByUserId(int userId)
        {
            try
            {
                var user = await _feedbackService.GetUserDetailsByUserId(userId);

                if (user == null)
                {
                    return NotFound("User not found");
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}