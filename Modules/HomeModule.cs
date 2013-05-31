using System.Linq;
using System.Security.Claims;
using Controll.Hosting.Infrastructure;
using ControllWeb.Infrastructure;
using Microsoft.Owin;

namespace ControllWeb
{
    using Nancy;

    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = parameters =>
                {
                    var user = Context.CurrentUser as ClaimsPrincipalUserIdentity;
                    if (user != null &&
                        user.ClaimsPrincipal != null && 
                        user.ClaimsPrincipal.HasClaim(ControllClaimTypes.UserIdentifier))

                        return View["layoutmock"];

                    return View["login"];
                };

            Get["/mock"] = parameters => View["layoutmock"];
            Get["/login"] = _ => View["login"];
        }
    }
}