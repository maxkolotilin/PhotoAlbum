using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using PhotoAlbum.Models;
using System.Threading.Tasks;

namespace PhotoAlbum.Hubs
{
    public class CommentsHub : Hub
    {
        public void AddComment(int commentId)
        {
            var id = Context.ConnectionId;
            Clients.AllExcept(id).updateLastComment(commentId);
        }

        public void DeleteComment(int commentId)
        {
            var id = Context.ConnectionId;
            Clients.AllExcept(id).deleteComment(commentId);
        }
    }
}