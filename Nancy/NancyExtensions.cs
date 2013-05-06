using System.Security.Claims;
using Nancy;

namespace ControllWeb.Nancy
{
    public static class NancyExtensions
    {
        public static ClaimsPrincipal GetPrincipal(this NancyModule module)
        {
            var userIdentity = module.Context.CurrentUser as ClaimsPrincipalUserIdentity;

            if (userIdentity == null)
            {
                return null;
            }

            return userIdentity.ClaimsPrincipal;
        }

        public static bool IsAuthenticated(this NancyModule module)
        {
            var principal = module.GetPrincipal();
            return principal != null && principal.Identity.IsAuthenticated;
        }
    }
}