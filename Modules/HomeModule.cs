using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;

namespace ControllWeb.Modules
{
    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = _ =>
                {
                    var view = View["index"];
                    
                    return view;
                };
        }
    }
}