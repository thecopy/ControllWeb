using Nancy;

namespace ControllWeb.Nancy
{
    public class DocumentationModule : NancyModule
    {
        public DocumentationModule() : base("/documentation/")
        {
            Get["/"] = _ => View["index.cshtml"];
        }
    }
}