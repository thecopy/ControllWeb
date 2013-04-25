using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;

namespace ControllWeb.Modules
{
    public class DocumentationModule : NancyModule
    {
        public DocumentationModule() : base("/Documentation/")
        {
            Get["/"] = _ => View["index.cshtml"];
        }
    }
}