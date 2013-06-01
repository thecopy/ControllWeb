using System;
using Controll.Hosting.Infrastructure;
using Controll.Hosting.Helpers;
using ControllWeb.Infrastructure;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Logging;
using Owin;

namespace ControllWeb
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //app.UseTestLogger();

            var connectionStringAlias = "appharbor";
#if DEBUG
            connectionStringAlias = "mocked";
#endif

            app.UseControll(new ControllHostingConfiguration
                {
                    ConnectionStringAlias = connectionStringAlias,
                    ClearDatabase = false,
                    RedirectToLoginRoute = true,
                    LoginRoute = "/login",
                    DenyAnonymous = false,
                    HubConfiguration = new HubConfiguration
                        {
                            EnableDetailedErrors = true,
                            EnableCrossDomain = true
                        }
                });
            app.MapHubs();

            app.UseNancy(new ControllNancyBootstrapper());
        }
    }
}