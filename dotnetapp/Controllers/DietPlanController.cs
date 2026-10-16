using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/dietplan")]
    [Authorize]
    public class DietPlanController : ControllerBase
    {
        private readonly DietPlanService _dietPlanService;

        public DietPlanController(DietPlanService dietPlanService)
        {
            _dietPlanService = dietPlanService;
        }

        // Admin + User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DietPlan>>> GetAllDietPlans()
        {
            try
            {
                var dietPlans = await _dietPlanService.GetAllDietPlans();
                return Ok(dietPlans);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // Admin + User
        [HttpGet("{dietplanId}")]
        public async Task<ActionResult<DietPlan>> GetDietPlanById(int dietplanId)
        {
            try
            {
                var dietPlan = await _dietPlanService.GetDietPlanById(dietplanId);

                if (dietPlan == null)
                {
                    return NotFound("Cannot find any diet plan");
                }

                return Ok(dietPlan);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // Admin / Nutritionist only
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> AddDietPlan(
            [FromBody] DietPlan dietPlan)
        {
            try
            {
                var result = await _dietPlanService.AddDietPlan(dietPlan);

                if (result)
                {
                    return Ok("Diet plan added successfully");
                }

                return StatusCode(500, "Failed to add diet plan");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Admin / Nutritionist only
        [Authorize(Roles = "Admin")]
        [HttpPut("{dietplanId}")]
        public async Task<ActionResult> UpdateDietPlan(
            int dietplanId,
            [FromBody] DietPlan dietPlan)
        {
            try
            {
                var result = await _dietPlanService
                    .UpdateDietplan(dietplanId, dietPlan);

                if (!result)
                {
                    return NotFound("Cannot find any diet plan");
                }

                return Ok("Diet plan updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Admin / Nutritionist only
        [Authorize(Roles = "Admin")]
        [HttpDelete("{dietplanId}")]
        public async Task<ActionResult> DeleteDietPlan(int dietplanId)
        {
            try
            {
                var result = await _dietPlanService
                    .DeleteDietplan(dietplanId);

                if (!result)
                {
                    return NotFound("Cannot find any diet plan");
                }

                return Ok("Diet plan deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{dietplanId}/enrolledusers")]
        public async Task<ActionResult> GetEnrolledUsers(int dietplanId)
        {
            try
            {
                var users = await _dietPlanService
                    .GetEnrolledUsers(dietplanId);

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}