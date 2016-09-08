﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace PhotoAlbum
{
    public class RouteConfig
    {
        public class GuidConstraint : IRouteConstraint
        {

            public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
            {
                if (values.ContainsKey(parameterName))
                {
                    string stringValue = values[parameterName] as string;

                    if (!string.IsNullOrEmpty(stringValue))
                    {
                        Guid guidValue;

                        return Guid.TryParse(stringValue, out guidValue) && (guidValue != Guid.Empty);
                    }
                }

                return false;
            }
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Photo",
                url: "Photo/{guid}",
                defaults: new { controller = "Photo", action = "GetByReference" },
                constraints: new { guid = new GuidConstraint() }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
