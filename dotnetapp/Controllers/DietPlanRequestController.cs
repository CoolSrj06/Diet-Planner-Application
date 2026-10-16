using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DietPlanRequestController : ControllerBase
    {
        private readonly DietPlanRequestService _dietPlanRequestService;

        public DietPlanRequestController(
            DietPlanRequestService dietPlanRequestService)
        {
            _dietPlanRequestService =
                dietPlanRequestService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DietPlanRequest>>>
            GetAllDietPlanRequests()
        {
            try
            {
                var requests =
                    await _dietPlanRequestService
                    .GetAllDietPlanRequests();

                return Ok(requests);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<ActionResult>
            AddDietPlanRequest(
                [FromBody]
                DietPlanRequest dietPlanRequest)
        {
            try
            {
                var result =
                    await _dietPlanRequestService
                    .AddDietPlanRequest(
                        dietPlanRequest);

                if (result)
                {
                    return Ok(
                        "Diet Plan Request added successfully");
                }

                return StatusCode(
                    500,
                    "Failed to add diet plan request");
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    ex.Message);
            }
        }

        [Authorize(Roles = "User")]
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<DietPlanRequest>>>
            GetDietPlanRequestsByUserId(
                int userId)
        {
            try
            {
                var requests =
                    await _dietPlanRequestService
                    .GetDietPlanRequestsByUserId(
                        userId);

                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{dietPlanRequestId}")]
        public async Task<ActionResult>
            UpdateDietPlanRequest(
                int dietPlanRequestId,
                [FromBody]
                DietPlanRequest dietPlanRequest)
        {
            try
            {
                var result =
                    await _dietPlanRequestService
                    .UpdateDietPlanRequest(
                        dietPlanRequestId,
                        dietPlanRequest);

                if (!result)
                {
                    return NotFound(
                        "Cannot find any diet plan request");
                }

                return Ok(
                    "Diet Plan Request updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    ex.Message);
            }
        }

        [Authorize(Roles = "User")]
        [HttpDelete("{dietPlanRequestId}")]
        public async Task<ActionResult>
            DeleteDietPlanRequest(
                int dietPlanRequestId)
        {
            try
            {
                var result =
                    await _dietPlanRequestService
                    .DeleteDietPlanRequest(
                        dietPlanRequestId);

                if (!result)
                {
                    return NotFound(
                        "Cannot find any diet plan request");
                }

                return Ok(
                    "Diet Plan Request deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    ex.Message);
            }
        }

        [Authorize(Roles = "Admin,User")]
        [HttpGet("username/{userId}")]
        public async Task<ActionResult<object>>
            GetUserNameByUserId(
                int userId)
        {
            try
            {
                var username =
                    await _dietPlanRequestService
                    .GetUserNameByUserId(
                        userId);

                if (string.IsNullOrEmpty(username))
                {
                    return NotFound(
                        new
                        {
                            message =
                                "User not found"
                        });
                }

                return Ok(
                    new
                    {
                        username
                    });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    ex.Message);
            }
        }
    }
}