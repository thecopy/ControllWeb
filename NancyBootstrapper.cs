using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Session;
using Nancy.TinyIoc;

namespace ControllWeb
{
    public class Bootstrapper : DefaultNancyBootstrapper
    {
        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
        {
            CookieBasedSessions.Enable(pipelines);
            
            //Controll.Hosting.Bootstrapper.StrapTheBoot();
            
            //RouteTable.Routes.MapHubs(new HubConfiguration
            //    {
            //        Resolver = Controll.Hosting.Bootstrapper.NinjectDependencyResolver
            //    });
        }
    }
}