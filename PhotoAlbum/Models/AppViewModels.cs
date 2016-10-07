using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PhotoAlbum.Models
{
    public class AlbumViewModel
    {
        public Album Album { get; set; }
        public IEnumerable<Photo> Photos { get; set; }
    }

    public class AlbumIndexViewModel
    {
        public Album Album { get; set; }
        public double? Rating { get; set; }
    }

    public class CommentView
    {
        public int CommentId { get; set; }
        public string Comment { get; set; }
        public DateTime DateTime { get; set; }
        public string UserName { get; set; }
    }

    public class CommentPostData
    {
        public string Comment { get; set; }
        public int Id { get; set; }
    }
}