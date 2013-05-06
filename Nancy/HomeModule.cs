using Nancy;

namespace ControllWeb.Nancy
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