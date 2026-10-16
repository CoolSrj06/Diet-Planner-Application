using dotnetapp.Exceptions;
using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Linq;
using System.Reflection;
using dotnetapp.Services;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;

namespace dotnetapp.Tests
{
    [TestFixture]
    public class Tests
    {

        private ApplicationDbContext _context; 
        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: "TestDatabase").Options;
            _context = new ApplicationDbContext(options);
           
             _httpClient = new HttpClient();
             _httpClient.BaseAddress = new Uri("http://localhost:8080");

        }

        [TearDown]
        public void TearDown()
        {
             _context.Dispose();
        }

[Test, Order(1)]
 public async Task Backend_Test_Post_Method_Register_Nutritionist_Returns_HttpStatusCode_OK()
    {
        ClearDatabase();
        string uniqueId = Guid.NewGuid().ToString();

        // Generate a unique userName based on a timestamp
        string uniqueUsername = $"abcd_{uniqueId}";
        string uniqueEmail = $"abcd{uniqueId}@gmail.com";

        string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Nutritionist\"}}";
        HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

        Console.WriteLine(response.StatusCode);
        string responseString = await response.Content.ReadAsStringAsync();

        Console.WriteLine(responseString);
        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
    }
  
   [Test, Order(2)]
public async Task Backend_Test_Post_Method_Login_Nutritionist_Returns_HttpStatusCode_OK()
    {
        ClearDatabase();

        string uniqueId = Guid.NewGuid().ToString();

        // Generate a unique userName based on a timestamp
        string uniqueUsername = $"abcd_{uniqueId}";
        string uniqueEmail = $"abcd{uniqueId}@gmail.com";

        string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Nutritionist\"}}";
        HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

        // Print registration response
        string registerResponseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Registration Response: " + registerResponseBody);

        // Login with the registered user
        string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
        HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

        // Print login response
        string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Login Response: " + loginResponseBody);

        Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
    }

[Test, Order(3)]
public async Task Backend_Test_Get_All_Diet_Plan_With_Token_By_User_Returns_HttpStatusCode_OK()
{
    ClearDatabase();
    string uniqueId = Guid.NewGuid().ToString();

    // Generate a unique userName based on a timestamp
    string uniqueUsername = $"abcd_{uniqueId}";
    string uniqueEmail = $"abcd{uniqueId}@gmail.com";

    string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"User\"}}";
    HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

    // Print registration response
    string registerResponseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Registration Response: " + registerResponseBody);

    // Login with the registered user
    string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
    HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

    // Print login response
    string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
    Console.WriteLine("Login Response: " + loginResponseBody);

    Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
    string responseBody = await loginResponse.Content.ReadAsStringAsync();

    dynamic responseMap = JsonConvert.DeserializeObject(responseBody);

    string token = responseMap.token;

    Assert.IsNotNull(token);

    // Use the token to get all feeds
    _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
    HttpResponseMessage apiResponse = await _httpClient.GetAsync("/api/dietplan");

    // Print feed response
    string apiResponseBody = await apiResponse.Content.ReadAsStringAsync();
    Console.WriteLine("apiResponseBody: " + apiResponseBody);

    Assert.AreEqual(HttpStatusCode.OK, apiResponse.StatusCode);
}

[Test, Order(4)]
public async Task Backend_Test_Get_All_Diet_Plan_Without_Token_By_User_Returns_HttpStatusCode_Unauthorized()
{
    ClearDatabase();
    string uniqueId = Guid.NewGuid().ToString();

    // Generate a unique userName based on a timestamp
    string uniqueUsername = $"abcd_{uniqueId}";
    string uniqueEmail = $"abcd{uniqueId}@gmail.com";

    string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"User\"}}";
    HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

    // Print registration response
    string registerResponseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Registration Response: " + registerResponseBody);

    // Login with the registered user
    string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
    HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

    // Print login response
    string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
    Console.WriteLine("Login Response: " + loginResponseBody);

    Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
    string responseBody = await loginResponse.Content.ReadAsStringAsync();

    HttpResponseMessage apiResponse = await _httpClient.GetAsync("/api/dietplan");

    // Print feed response
    string apiResponseBody = await apiResponse.Content.ReadAsStringAsync();
    Console.WriteLine("apiResponseBody: " + apiResponseBody);

    Assert.AreEqual(HttpStatusCode.Unauthorized, apiResponse.StatusCode);
}

[Test, Order(5)]
public async Task Backend_Test_Get_Method_GetAllDietPlans_In_DietPlan_Service_Fetches_Successfully()
{
    ClearDatabase();

    // Add diet plans
    var dietPlansData = new List<Dictionary<string, object>>
    {
        new Dictionary<string, object>
        {
            { "DietPlanId", 1 },
            { "PlanName", "Plan A" },
            { "Description", "Description A" },
            { "Duration", 30 },
            { "CreatedAt", DateTime.Now }
        },
        new Dictionary<string, object>
        {
            { "DietPlanId", 2 },
            { "PlanName", "Plan B" },
            { "Description", "Description B" },
            { "Duration", 45 },
            { "CreatedAt", DateTime.Now }
        }
    };

    foreach (var planData in dietPlansData)
    {
        var dietPlan = new DietPlan();
        foreach (var kvp in planData)
        {
            var propertyInfo = typeof(DietPlan).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(dietPlan, kvp.Value);
            }
        }
        _context.DietPlans.Add(dietPlan);
    }
    _context.SaveChanges();

    // Invoke service method
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.DietPlanService";

    Type serviceType = assembly.GetType(ServiceName);
    MethodInfo method = serviceType.GetMethod("GetAllDietPlans");

    if (method != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var result = (Task<IEnumerable<DietPlan>>)method.Invoke(service, null);
        Assert.IsNotNull(result);
        var dietPlans = await result;
        Assert.AreEqual(2, dietPlans.Count());
        Assert.IsTrue(dietPlans.Any(dp => dp.PlanName == "Plan A"));
        Assert.IsTrue(dietPlans.Any(dp => dp.PlanName == "Plan B"));
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(6)]
public async Task Backend_Test_Get_Method_GetDietPlanById_In_DietPlan_Service_Fetches_Successfully()
{
    ClearDatabase();

    // Add a diet plan
    var dietPlanData = new Dictionary<string, object>
    {
        { "DietPlanId", 3 },
        { "PlanName", "Plan C" },
        { "Description", "Description C" },
        { "Duration", 60 },
        { "CreatedAt", DateTime.Now }
    };

    var dietPlan = new DietPlan();
    foreach (var kvp in dietPlanData)
    {
        var propertyInfo = typeof(DietPlan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(dietPlan, kvp.Value);
        }
    }
    _context.DietPlans.Add(dietPlan);
    _context.SaveChanges();

    // Invoke service method
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.DietPlanService";

    Type serviceType = assembly.GetType(ServiceName);
    MethodInfo method = serviceType.GetMethod("GetDietPlanById");

    if (method != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var result = (Task<DietPlan>)method.Invoke(service, new object[] { 3 });
        Assert.IsNotNull(result);
        var fetchedDietPlan = await result;

        Assert.IsNotNull(fetchedDietPlan);
        Assert.AreEqual("Plan C", fetchedDietPlan.PlanName);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(7)]
public async Task Backend_Test_Post_Method_Add_DietPlan_In_DietPlanService_Adds_DietPlan_Successfully()
{
    ClearDatabase();

    // Set up diet plan data
    var dietPlanData = new Dictionary<string, object>
    {
        { "DietPlanId", 1 },
        { "PlanName", "Healthy Plan" },
        { "Description", "A healthy diet plan" },
        { "Duration", 30 },
        { "CreatedAt", DateTime.Now }
    };

    var dietPlan = new DietPlan();
    foreach (var kvp in dietPlanData)
    {
        var propertyInfo = typeof(DietPlan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(dietPlan, kvp.Value);
        }
    }

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.DietPlanService";

    Type serviceType = assembly.GetType(serviceName);

    // Get the AddDietPlan method
    MethodInfo addDietPlanMethod = serviceType.GetMethod("AddDietPlan");

    // Check if method exists
    if (addDietPlanMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var addDietPlanTask = (Task<bool>)addDietPlanMethod.Invoke(service, new object[] { dietPlan });
        var result = await addDietPlanTask;

        // Assert that the diet plan was added successfully
        Assert.IsTrue(result);

        // Verify that the diet plan was added
        var retrievedDietPlan = await _context.DietPlans.FindAsync(1);

        // Assert the retrieved diet plan is not null and properties match
        Assert.IsNotNull(retrievedDietPlan);
        Assert.AreEqual(dietPlan.PlanName, retrievedDietPlan.PlanName);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(8)]
public async Task Backend_Test_Post_Method_Add_DietPlan_In_DietPlanService_Throws_DietPlanException_If_Name_Exists()
{
    ClearDatabase();

    // Set up initial diet plan data
    var initialDietPlanData = new Dictionary<string, object>
    {
        { "DietPlanId", 1 },
        { "PlanName", "Duplicate Plan" },
        { "Description", "Initial diet plan description" },
        { "Duration", 30 },
        { "CreatedAt", DateTime.Now }
    };

    var initialDietPlan = new DietPlan();
    foreach (var kvp in initialDietPlanData)
    {
        var propertyInfo = typeof(DietPlan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(initialDietPlan, kvp.Value);
        }
    }
    _context.DietPlans.Add(initialDietPlan);
    await _context.SaveChangesAsync();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.DietPlanService";

    Type serviceType = assembly.GetType(serviceName);

    // Get the AddDietPlan method
    MethodInfo addDietPlanMethod = serviceType.GetMethod("AddDietPlan");

    // Check if method exists
    if (addDietPlanMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);

        // Attempt to add a new diet plan with the same name
        var duplicateDietPlanData = new Dictionary<string, object>
        {
            { "DietPlanId", 2 },
            { "PlanName", "Duplicate Plan" },
            { "Description", "Duplicate diet plan description" },
            { "Duration", 45 },
            { "CreatedAt", DateTime.Now }
        };

        var duplicateDietPlan = new DietPlan();
        foreach (var kvp in duplicateDietPlanData)
        {
            var propertyInfo = typeof(DietPlan).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(duplicateDietPlan, kvp.Value);
            }
        }

        try
        {
            var addDietPlanTask = (Task<bool>)addDietPlanMethod.Invoke(service, new object[] { duplicateDietPlan });
           Console.WriteLine("res" + addDietPlanTask.Result);

            // If no exception is thrown, fail the test
            Assert.Fail();
        }
        catch (Exception ex)
        {
            Assert.IsNotNull(ex.InnerException);
            Assert.IsTrue(ex.InnerException is DietPlanException);
            Assert.AreEqual("Diet Plan with the same name already exists", ex.InnerException.Message);
        }
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(9)]
public async Task Backend_Test_Post_Method_AddDietPlan_In_DietPlan_Service_Adds_Successfully()
{
    ClearDatabase();

    // Add initial diet plan
    var initialDietPlanData = new Dictionary<string, object>
    {
        { "DietPlanId", 1 },
        { "PlanName", "Unique Plan" },
        { "Description", "Initial Description" },
        { "Duration", 30 },
        { "CreatedAt", DateTime.Now }
    };

    var initialDietPlan = new DietPlan();
    foreach (var kvp in initialDietPlanData)
    {
        var propertyInfo = typeof(DietPlan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(initialDietPlan, kvp.Value);
        }
    }
    _context.DietPlans.Add(initialDietPlan);
    _context.SaveChanges();

    // New diet plan to add
    var newDietPlanData = new Dictionary<string, object>
    {
        { "DietPlanId", 2 },
        { "PlanName", "New Plan" },
        { "Description", "New Description" },
        { "Duration", 45 },
        { "CreatedAt", DateTime.Now }
    };

    var newDietPlan = new DietPlan();
    foreach (var kvp in newDietPlanData)
    {
        var propertyInfo = typeof(DietPlan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(newDietPlan, kvp.Value);
        }
    }

    // Invoke service method
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.DietPlanService";

    Type serviceType = assembly.GetType(ServiceName);
    MethodInfo addMethod = serviceType.GetMethod("AddDietPlan");

    if (addMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var result = (Task<bool>)addMethod.Invoke(service, new object[] { newDietPlan });
        var addResult = await result;

        Assert.IsTrue(addResult);

        var addedDietPlan = await _context.DietPlans.FindAsync(2);
        Assert.IsNotNull(addedDietPlan);
        Assert.AreEqual("New Plan", addedDietPlan.PlanName);
        Assert.AreEqual("New Description", addedDietPlan.Description);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(10)]
public async Task Backend_Test_Get_Method_GetDietPlanRequestById_In_DietPlanService_Fetches_DietPlanRequest_Successfully()
{
    ClearDatabase();

    // Set up user data
    var userData = new Dictionary<string, object>
    {
        { "UserId", 1 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    // Set up diet plan data
    var dietPlanData = new Dictionary<string, object>
    {
        { "DietPlanId", 1 },
        { "PlanName", "Healthy Plan" },
        { "Description", "A healthy diet plan" },
        { "Duration", 30 },
        { "CreatedAt", DateTime.Now }
    };

    var dietPlan = new DietPlan();
    foreach (var kvp in dietPlanData)
    {
        var propertyInfo = typeof(DietPlan).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(dietPlan, kvp.Value);
        }
    }
    _context.DietPlans.Add(dietPlan);
    await _context.SaveChangesAsync();

    // Set up diet plan request data
    var dietPlanRequestData = new Dictionary<string, object>
    {
        { "DietPlanRequestId", 1 },
        { "UserId", 1 },
        { "DietPlanId", 1 },
        { "Age", 25 },
        { "Weight", 70.5 },
        { "Height", 175.0 },
        { "Gender", "Male" },
        { "ActivityLevel", "Moderate" },
        { "Goal", "Weight Loss" },
        { "MedicalConditions", "None" },
        { "CreatedAt", DateTime.Now },
        { "Status", "Pending" }
    };

    var dietPlanRequest = new DietPlanRequest();
    foreach (var kvp in dietPlanRequestData)
    {
        var propertyInfo = typeof(DietPlanRequest).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(dietPlanRequest, kvp.Value);
        }
    }
    _context.DietPlanRequests.Add(dietPlanRequest);
    await _context.SaveChangesAsync();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.DietPlanRequestService";

    Type serviceType = assembly.GetType(serviceName);

    // Get the GetDietPlanRequestById method
    MethodInfo getDietPlanRequestByIdMethod = serviceType.GetMethod("GetDietPlanRequestById");

    // Check if method exists
    if (getDietPlanRequestByIdMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var getDietPlanRequestByIdTask = (Task<DietPlanRequest>)getDietPlanRequestByIdMethod.Invoke(service, new object[] { 1 });
        var result = await getDietPlanRequestByIdTask;
        Assert.IsNotNull(result);
        Assert.AreEqual(dietPlanRequest.Age, result.Age);

    }
    else
    {
        Assert.Fail();
    }
}
[Test, Order(11)]
public async Task Backend_Test_Post_Method_AddFeedback_In_Feedback_Service_Posts_Successfully()
{
     ClearDatabase();

    // Add user
    var userData = new Dictionary<string, object>
    {
        { "UserId",42 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();
    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("AddFeedback", new[] { modelType });

    if (method != null)
    {
           var feedbackData = new Dictionary<string, object>
            {
                { "FeedbackId", 11 },
                { "UserId", 42 },
                { "FeedbackText", "Great experience!" },
                { "Date", DateTime.Now }
            };
        var feedback = new Feedback();
        foreach (var kvp in feedbackData)
        {
            var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(feedback, kvp.Value);
            }
        }
        var service = Activator.CreateInstance(serviceType, _context);
        var result = (Task<bool>)method.Invoke(service, new object[] { feedback });
    
        var addedFeedback= await _context.Feedbacks.FindAsync(11);
        Assert.IsNotNull(addedFeedback);
        Assert.AreEqual("Great experience!",addedFeedback.FeedbackText);

    }
    else{
        Assert.Fail();
    }
}

[Test, Order(12)]
public async Task Backend_Test_Delete_Method_Feedback_In_Feeback_Service_Deletes_Successfully()
{
    // Add user
     ClearDatabase();

    var userData = new Dictionary<string, object>
    {
        { "UserId",42 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

           var feedbackData = new Dictionary<string, object>
            {
                { "FeedbackId", 11 },
                { "UserId", 42 },
                { "FeedbackText", "Great experience!" },
                { "Date", DateTime.Now }
            };
        var feedback = new Feedback();
        foreach (var kvp in feedbackData)
        {
            var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(feedback, kvp.Value);
            }
        }
     _context.Feedbacks.Add(feedback);
    _context.SaveChanges();
    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

  
    MethodInfo deletemethod = serviceType.GetMethod("DeleteFeedback", new[] { typeof(int) });

    if (deletemethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var deleteResult = (Task<bool>)deletemethod.Invoke(service, new object[] { 11 });

        var deletedFeedbackFromDb = await _context.Feedbacks.FindAsync(11);
        Assert.IsNull(deletedFeedbackFromDb);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(13)]
public async Task Backend_Test_Get_Method_GetFeedbacksByUserId_In_Feedback_Service_Fetches_Successfully()
{
    ClearDatabase();

    // Add user
    var userData = new Dictionary<string, object>
    {
        { "UserId", 330 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

    var feedbackData= new Dictionary<string, object>
    {
        { "FeedbackId", 13 },
        { "UserId", 330 },
        { "FeedbackText", "Great experience!" },
        { "Date", DateTime.Now }
    };

    var feedback = new Feedback();
    foreach (var kvp in feedbackData)
    {
        var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(feedback, kvp.Value);
        }
    }
    _context.Feedbacks.Add(feedback);
    _context.SaveChanges();

    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("GetFeedbacksByUserId");

    if (method != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var result = ( Task<IEnumerable<Feedback>>)method.Invoke(service, new object[] {330});
        Assert.IsNotNull(result);
         var check=true;
        foreach (var item in result.Result)
        {
            check=false;
            Assert.AreEqual("Great experience!", item.FeedbackText);
   
        }
        if(check==true)
        {
            Assert.Fail();

        }
    }
    else{
        Assert.Fail();
    }
}

private void ClearDatabase()
{
    _context.Database.EnsureDeleted();
    _context.Database.EnsureCreated();
}

}
}

