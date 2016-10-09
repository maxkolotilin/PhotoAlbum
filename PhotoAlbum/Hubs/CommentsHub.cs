using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace PhotoAlbum.Hubs
{
    public class CommentsHub : Hub
    {
        public void AddComment(int commentId)
        {
            Clients.Others.getLastComment(commentId);
        }

        public void DeleteComment(int commentId)
        {
            Clients.Others.deleteComment(commentId);
        }
    }
}
