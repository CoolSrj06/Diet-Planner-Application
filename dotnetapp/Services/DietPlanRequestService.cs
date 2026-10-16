using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Models;

namespace dotnetapp.Services
{
    public class DietPlanRequestService
    {
        private readonly ApplicationDbContext _context;

        public DietPlanRequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Get all diet plan requests
        public async Task<IEnumerable<DietPlanRequest>> GetAllDietPlanRequests()
        {
            return await _context.DietPlanRequests
                .Include(d => d.User)
                .Include(d => d.DietPlan)
                .ToListAsync();
        }

        // 2. Add diet plan request
        public async Task<bool> AddDietPlanRequest(
            DietPlanRequest dietPlanRequest)
        {
            _context.DietPlanRequests.Add(
                dietPlanRequest);

            await _context.SaveChangesAsync();

            return true;
        }

        // 3. Update diet plan request
        public async Task<bool> UpdateDietPlanRequest(
            int dietPlanRequestId,
            DietPlanRequest dietPlanRequest)
        {
            var existingRequest =
                await _context.DietPlanRequests
                .FirstOrDefaultAsync(d =>
                    d.DietPlanRequestId ==
                    dietPlanRequestId);

            if (existingRequest == null)
            {
                return false;
            }

            existingRequest.UserId =
                dietPlanRequest.UserId;

            existingRequest.DietPlanId =
                dietPlanRequest.DietPlanId;

            existingRequest.Age =
                dietPlanRequest.Age;

            existingRequest.Weight =
                dietPlanRequest.Weight;

            existingRequest.Height =
                dietPlanRequest.Height;

            existingRequest.Gender =
                dietPlanRequest.Gender;

            existingRequest.ActivityLevel =
                dietPlanRequest.ActivityLevel;

            existingRequest.Goal =
                dietPlanRequest.Goal;

            existingRequest.MedicalConditions =
                dietPlanRequest.MedicalConditions;

            existingRequest.CreatedAt =
                dietPlanRequest.CreatedAt;

            existingRequest.Status =
                dietPlanRequest.Status;

            await _context.SaveChangesAsync();

            return true;
        }

        // 4. Delete diet plan request
        public async Task<bool> DeleteDietPlanRequest(
            int dietPlanRequestId)
        {
            var dietPlanRequest =
                await _context.DietPlanRequests
                .FirstOrDefaultAsync(d =>
                    d.DietPlanRequestId ==
                    dietPlanRequestId);

            if (dietPlanRequest == null)
            {
                return false;
            }

            _context.DietPlanRequests.Remove(
                dietPlanRequest);

            await _context.SaveChangesAsync();

            return true;
        }

        // 5. Get ALL requests by UserId
        public async Task<IEnumerable<DietPlanRequest>>
            GetDietPlanRequestsByUserId(int userId)
        {
            return await _context.DietPlanRequests
                .Where(d => d.UserId == userId)
                .ToListAsync();
        }

        public async Task<string?> GetUserNameByUserId(
            int userId)
        {
            var request =
                await _context.DietPlanRequests
                .Include(d => d.User)
                .FirstOrDefaultAsync(d =>
                    d.UserId == userId);

            return request?.User?.Username;
        }
    }
}