using System;
using Controll.Hosting.Infrastructure;
using Controll.Hosting.Helpers;
using ControllWeb.Infrastructure;
using Microsoft.Owin.Logging;
using Owin;

namespace ControllWeb
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseControll(new ControllHostingConfiguration
                {
                    ConnectionStringAlias = "mocked",
                    ClearDatabase = false,
                    RedirectToLoginRoute = true,
                    LoginRoute = "/login",
                    DenyAnonymous = false
                });
            app.UseNancy(new ControllNancyBootstrapper());
        }
    }
}