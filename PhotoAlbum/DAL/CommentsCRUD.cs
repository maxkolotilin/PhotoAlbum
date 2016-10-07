using PhotoAlbum.Models;
using System.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace PhotoAlbum.DAL
{
    public class CommentsCRUD : IDisposable
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        public IEnumerable<CommentView> GetCommentsChunk(int albumId, int chunkIndex, int chunkSize)
        {
            return db.Comments.Include(c => c.User)
                .Where(c => c.AlbumId == albumId)
                .OrderByDescending(x => x.DateTime)
                .Skip(chunkIndex * chunkSize).Take(chunkSize)
                .Select(c => new CommentView
                {
                    CommentId = c.Id,
                    Comment = c.CommentText,
                    DateTime = c.DateTime,
                    UserName = c.User.UserName
                }).ToList();
        }

        public IEnumerable<CommentView> GetAllComments(int albumId)
        {
            return db.Comments.Include(c => c.User)
                .Where(c => c.AlbumId == albumId)
                .OrderByDescending(x => x.DateTime)
                .Select(c => new CommentView
                {
                    CommentId = c.Id,
                    Comment = c.CommentText,
                    DateTime = c.DateTime,
                    UserName = c.User.UserName
                }).ToList();
        }

        public CommentView GetComment(int commentId)
        {
            var comment = db.Comments.Include(c => c.User).FirstOrDefault(c => c.Id == commentId);
            return new CommentView
            {
                CommentId = commentId,
                Comment = comment.CommentText,
                DateTime = comment.DateTime,
                UserName = comment.User.UserName
            };
        }

        public Comment CreateComment(string commentText, int albumId, string userId)
        {
            var comment = new Comment
            {
                CommentText = commentText,
                AlbumId = albumId,
                ApplicationUserId = userId
            };
            db.Comments.Add(comment);

            return comment;
        }

        public void DeleteComment(int id)
        {
            db.Comments.Remove(db.Comments.Find(id));
        }

        public void SaveChanges()
        {
            db.SaveChanges();
        }

        #region IDisposable Support
        private bool disposedValue = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    db.Dispose();
                }
                disposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion
    }
}