using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PhotoAlbum.Models;

namespace PhotoAlbum.Controllers
{
    [Authorize]
    public class AlbumsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        public ActionResult Slideshow(int albumId)
        {
            var album = db.Albums.Include(a => a.Photos).Single(a => a.Id == albumId);

            ViewBag.photoUrls = new List<String>();
            foreach (var photo in album.Photos)
            {
                ViewBag.photoUrls.Add($"/Photo/{ photo.Guid }");
            }
            ViewBag.timeout = 2000;
            ViewBag.transition = 400;

            return View();
        }

        [HttpPost]
        public void ReplaceImage(string aviaryUrl, int id)
        {
            var photo = db.Photos.Find(id);
            using (var client = new WebClient())
            {
                photo.Image = client.DownloadData(new Uri(aviaryUrl));
                db.SaveChanges();
            }
        }

        // GET: Albums
        [AllowAnonymous]
        public async Task<ActionResult> Index()
        {
            var albums = db.Albums.Include(a => a.User);
            return View(await albums.ToListAsync());
        }

        // GET: Albums/Details/5
        [AllowAnonymous]
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Album album = await db.Albums.FindAsync(id);
            if (album == null)
            {
                return HttpNotFound();
            }
            var AlbumView = new AlbumViewModel
            {
                Album = album,
                Photos = album.Photos,
            };
            return View(AlbumView);
        }

        // GET: Albums/Create
        public ActionResult Create()
        {
            ViewBag.ApplicationUserId = new SelectList(db.Users, "Id", "Email");
            return View();
        }

        // POST: Albums/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,AlbumName,IsPrivate,ApplicationUserId")] Album album)
        {
            if (ModelState.IsValid)
            {
                db.Albums.Add(album);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.ApplicationUserId = new SelectList(db.Users, "Id", "Email", album.ApplicationUserId);
            return View(album);
        }

        // GET: Albums/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Album album = await db.Albums.FindAsync(id);
            if (album == null)
            {
                return HttpNotFound();
            }
            ViewBag.ApplicationUserId = new SelectList(db.Users, "Id", "Email", album.ApplicationUserId);
            return View(album);
        }

        // POST: Albums/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,AlbumName,IsPrivate,ApplicationUserId")] Album album)
        {
            if (ModelState.IsValid)
            {
                db.Entry(album).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.ApplicationUserId = new SelectList(db.Users, "Id", "Email", album.ApplicationUserId);
            return View(album);
        }

        // GET: Albums/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Album album = await db.Albums.FindAsync(id);
            if (album == null)
            {
                return HttpNotFound();
            }
            return View(album);
        }

        // POST: Albums/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            Album album = await db.Albums.FindAsync(id);
            db.Albums.Remove(album);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
