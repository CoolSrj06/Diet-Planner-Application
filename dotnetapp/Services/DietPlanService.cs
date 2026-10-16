using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
    public class DietPlanService
    {
        private readonly ApplicationDbContext _context;

        public DietPlanService(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Get all diet plans
        public async Task<IEnumerable<DietPlan>> GetAllDietPlans()
        {
            return await _context.DietPlans.ToListAsync();
        }

        // 2. Get diet plan by ID
        public async Task<DietPlan> GetDietPlanById(int dietplanId)
        {
            return await _context.DietPlans
                .FirstOrDefaultAsync(d => d.DietPlanId == dietplanId);
        }

        // 3. Add diet plan
        public async Task<bool> AddDietPlan(DietPlan dietPlan)
        {
            // Check if a diet plan with the same name already exists
            var exists = await _context.DietPlans
                .FirstOrDefaultAsync(d => d.PlanName == dietPlan.PlanName);

            if (exists != null)
            {
                throw new DietPlanException(
                    "Diet Plan with the same name already exists");
            }

            _context.DietPlans.Add(dietPlan);

            await _context.SaveChangesAsync();

            return true;
        }

        // 4. Update diet plan
        public async Task<bool> UpdateDietplan(int dietplanId, DietPlan dietplan)
        {
            // Find the existing diet plan
            var existingDietPlan = await _context.DietPlans
                .FirstOrDefaultAsync(d => d.DietPlanId == dietplanId);

            if (existingDietPlan == null)
            {
                return false;
            }

            // Check whether another diet plan has the same name
            bool nameExists = await _context.DietPlans
                .AnyAsync(d =>
                    d.PlanName == dietplan.PlanName &&
                    d.DietPlanId != dietplanId);

            if (nameExists)
            {
                throw new DietPlanException(
                    "Diet Plan with the same name already exists.");
            }

            // Update the existing diet plan
            existingDietPlan.PlanName = dietplan.PlanName;
            existingDietPlan.Description = dietplan.Description;
            existingDietPlan.Duration = dietplan.Duration;
            existingDietPlan.CreatedAt = dietplan.CreatedAt;

            await _context.SaveChangesAsync();

            return true;
        }

        // 5. Delete diet plan
        public async Task<bool> DeleteDietplan(int dietplanId)
        {
            var dietplan = await _context.DietPlans
                .FirstOrDefaultAsync(d => d.DietPlanId == dietplanId);

            if (dietplan == null)
            {
                return false;
            }

            _context.DietPlans.Remove(dietplan);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<DietPlanRequest>> GetEnrolledUsers(int dietPlanId)
        {
            return await _context.DietPlanRequests
                .Where(x => x.DietPlanId == dietPlanId)
                .Include(x => x.User)
                .ToListAsync();
        }
    }
}