namespace ControllWeb
{
    using Nancy;

    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = parameters =>
            {
                return View["index"];
            };
            Get["/mock"] = parameters =>
            {
                return View["layoutmock"];
            };
        }
    }
}