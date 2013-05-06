using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using Microsoft.AspNet.SignalR;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Bootstrappers.Ninject;
using Nancy.Session;
using Nancy.TinyIoc;
using Ninject;
using Owin;

namespace ControllWeb
{
    //public class Bootstrapper : NinjectNancyBootstrapper
    //{

    //    protected override void ApplicationStartup(IKernel container, IPipelines pipelines)
    //    {

    //        ConfigureApplicationContainer(container);
    //        base.ApplicationStartup(container, pipelines);
    //        // Share Ninject-container
    //        /*Controll.Hosting.Bootstrapper.StrapTheBoot("mocked");

    //        CookieBasedSessions.Enable(pipelines);

    //        RouteTable.Routes.MapHubs(new HubConfiguration
    //        {
    //            Resolver = Controll.Hosting.Bootstrapper.NinjectDependencyResolver
    //        });*/
    //    }
    //}
}