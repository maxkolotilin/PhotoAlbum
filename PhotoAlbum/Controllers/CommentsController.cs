using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PhotoAlbum.Models;
using PhotoAlbum.DAL;
using Microsoft.AspNet.Identity;
using System.Web.Mvc;
using System.Web.Http.Description;
using System.Runtime.Serialization;
using Newtonsoft.Json.Linq;

namespace PhotoAlbum.Controllers
{
    public class CommentsController : ApiController
    {
        private CommentsCRUD commentsRepo = new CommentsCRUD();

        public IEnumerable<CommentView> GetComments(int albumId, int chunkIndex, int chunkSize)
        {
            return commentsRepo.GetCommentsChunk(albumId, chunkIndex, chunkSize);
        }

        // GET api/<controller>
        public IEnumerable<CommentView> GetComments(int albumId, int mark)
        {
            return commentsRepo.GetAllComments(albumId);
        }

        // GET api/<controller>/5
        public CommentView GetComment(int commentId)
        {
            return commentsRepo.GetComment(commentId);
        }

        // POST api/<controller>
        public IHttpActionResult Post(CommentPostData data)
        {
            var comment = commentsRepo.CreateComment(data.Comment, data.Id, User.Identity.GetUserId());
            commentsRepo.SaveChanges();
            var commentView = new CommentView
            {
                CommentId = comment.Id,
                Comment = comment.CommentText,
                DateTime = comment.DateTime,
                UserName = User.Identity.GetUserName()
            };

            return CreatedAtRoute("DefaultApi", new { }, commentView);
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {
            commentsRepo.DeleteComment(id);
            commentsRepo.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                commentsRepo.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}