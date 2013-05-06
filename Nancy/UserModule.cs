using Controll.Hosting.Services;
using Nancy;

namespace ControllWeb.Nancy
{
    public class UserModule : NancyModule
    {
        public UserModule() : base("/user")
        {
            Get["/signup"] = _ => View["User/Signup.cshtml"];
            Get["/signin"] = _ => View["User/Signup.cshtml"];

            Post["/signup"] = param =>
                {
                    string username = Request.Form.username;
                    string password = Request.Form.password;

                    //var user = membershipService.AuthenticateUser(username, password);

                    return "User id = ";// +user.Id;
                };

            Get["/"] = param =>
                {
                    if (!this.IsAuthenticated())
                    {
                        return Response.AsRedirect("signup");
                    }

                    return View["index.cshtml"];
                };
        }
    }
}