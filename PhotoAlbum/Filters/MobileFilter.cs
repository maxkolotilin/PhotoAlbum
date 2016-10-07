using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Routing;

namespace PhotoAlbum.Filters
{
    public class MobileAttribute : FilterAttribute, IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext filterContext)
        {

        }

        public void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Request.Browser.IsMobileDevice)
            {
                filterContext.Result = new RedirectToRouteResult(
                    new RouteValueDictionary
                    {
                        { "controller", "Albums" },
                        { "action", "Mobile" },
                        { "id", filterContext.ActionParameters["id"] }
                    }
                );
            }
        }
    }
}