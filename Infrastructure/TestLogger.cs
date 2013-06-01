using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Owin;
using Owin.Types;

namespace ControllWeb.Infrastructure
{
    using AppFunc = Func<IDictionary<string, object>, Task>;

    public class TestLogger
    {
        private readonly AppFunc _next;

        public TestLogger(AppFunc next)
        {
            if (next == null)
            {
                throw new ArgumentNullException("next");
            }
            _next = next;
        }

        public async Task Invoke(IDictionary<string, object> environment)
        {
            await _next(environment);

            var headers = (IDictionary<string, string[]>)environment["owin.ResponseHeaders"];
            string[] contentHeader;
            if (!headers.TryGetValue("Content-Type", out contentHeader))
                return;

            Debug.WriteLine(string.Format("Hitting TestLogger, path: {0}. Content-Type: {1} ", environment["owin.RequestPath"], contentHeader[0]));
        }
    }
    public static class TestLoggerExtensions
    {
        public static void UseTestLogger(this IAppBuilder builder)
        {
            if (builder == null)
            {
                throw new ArgumentNullException("builder");
            }

            builder.Use(typeof(TestLogger));
        }
    }
}