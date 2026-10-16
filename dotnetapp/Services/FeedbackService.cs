using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class FeedbackService
    {
        private readonly ApplicationDbContext _context;

        public FeedbackService(ApplicationDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<Feedback>> GetAllFeedbacks()
        {
            return await _context.Feedbacks.ToListAsync();
        }

        public async Task<IEnumerable<Feedback>> GetFeedbacksByUserId(int userId)
        {
            return await _context.Feedbacks.Where(f => f.UserId == userId).ToListAsync();
        }

        public async Task<bool> AddFeedback(Feedback feedback)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == feedback.UserId);

            if (user == null)
            {
                throw new Exception("User does not exist");
            }

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteFeedback(int feedbackId)
        {
            var feedback = _context.Feedbacks.FirstOrDefault(f => f.FeedbackId == feedbackId);
            if (feedback == null)
            {
                return false;

            }
            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();
            return true;
        }

        // Method 1: Get User Name by User ID
        public async Task<string?> GetUserNameByUserId(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            return user?.Username;
        }

        // Method 2: Get Full User Details by User ID
        public async Task<User?> GetUserDetailsByUserId(int userId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }
    }
}