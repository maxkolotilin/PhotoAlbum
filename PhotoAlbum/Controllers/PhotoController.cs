using Microsoft.AspNet.Identity;
using PhotoAlbum.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using static System.Net.Mime.MediaTypeNames;

namespace PhotoAlbum.Controllers
{
    public class PhotoController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpDelete]
        public ActionResult DeletePhoto(int photoId)
        {
            var photo = db.Photos.Find(photoId);
            if (photo == null)
            {
                return Json(new { Message = "Fail" });
            }
            db.Photos.Remove(photo);
            db.SaveChanges();

            return Json(new { Message = "Success" });
        }
        
        [HttpPost]
        public ActionResult SaveUploaded(int albumId)
        {
            if (db.Albums.Find(albumId).ApplicationUserId != User.Identity.GetUserId())
            {
                return new HttpStatusCodeResult(HttpStatusCode.Forbidden);
            }

            bool isSavedSuccessfully = true;
            string fName = "";

            try
            {
                HttpPostedFileBase file = Request.Files["file"];
                fName = file.FileName;

                if (file.ContentLength > 0)
                {
                    byte[] imageData = null;
                    using (var binaryReader = new BinaryReader(file.InputStream))
                    {
                        imageData = binaryReader.ReadBytes(file.ContentLength);
                    }

                    var parts = file.FileName.Split('.');
                    var format = "." + parts.Last();
                    var name = file.FileName.Replace(format, "");

                    var photo = new Photo()
                    {
                        Name = name,
                        Format = format,
                        Image = imageData,
                        AlbumId = albumId,
                    };

                    db.Photos.Add(photo);
                    db.SaveChanges();
                }
            }
            catch (Exception)
            {
                isSavedSuccessfully = false;
            }

            if (isSavedSuccessfully)
            {
                return Json(new { Message = fName });
            }
            else
            {
                return Json(new { Message = "Error in saving file" });
            }
        }

        [HttpGet]
        public ActionResult GetByReference(Guid guid)
        {
            var imageData = new MemoryStream(db.Photos.FirstOrDefault(x => x.Guid == guid).Image);

            return new FileStreamResult(imageData, "image/jpeg");
        }

        // GET: Photo
        public ActionResult Index()
        {
            return View();
        }

        // GET: Photo/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Photo/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Photo/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Photo/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Photo/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Photo/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Photo/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
