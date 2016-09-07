using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Owin;
using PhotoAlbum.Models;
using System.Web.Configuration;

[assembly: OwinStartupAttribute(typeof(PhotoAlbum.Startup))]
namespace PhotoAlbum
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            CreateRolesAndUsers();
        }

        private void CreateRolesAndUsers()
        {
            ApplicationDbContext context = new ApplicationDbContext();
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            var UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

            if (!roleManager.RoleExists("User"))
            {
                roleManager.Create(new IdentityRole() { Name = "User" });
            }
            if (!roleManager.RoleExists("Admin"))
            {
                roleManager.Create(new IdentityRole() { Name = "Admin" });
            }

            var user = new ApplicationUser()
            {
                UserName = WebConfigurationManager.AppSettings["AdminName"],
                Email = WebConfigurationManager.AppSettings["AdminEmail"],
                EmailConfirmed = true,
            };
            var result = UserManager.Create(user,
                WebConfigurationManager.AppSettings["AdminPassword"]);
            if (result.Succeeded)
            {
                UserManager.AddToRoles(user.Id, new[] { "Admin", "User" });
            }
        }
    }
}
