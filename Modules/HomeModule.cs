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
            Get["/"] = parameters => View["login"];
            Get["/login"] = _ => View["login"];

            Get["/mock"] = parameters => View["layoutmock"];
        }
    }
}