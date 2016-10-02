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
}