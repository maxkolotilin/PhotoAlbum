using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace PhotoAlbum.Models
{
    public class Album
    {
        public int Id { get; set; }
        [Required]
        public string AlbumName { get; set; }
        [Required]
        public bool IsPrivate { get; set; }

        public string ApplicationUserId { get; set; }
        public virtual ApplicationUser User { get; set; }

        public virtual List<Photo> Photos { get; set; }
        public virtual List<Comment> Comments { get; set; }
        public virtual List<Rating> Ratings { get; set; }
    }

    public class Photo
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [MaxLength(6)]
        public string Format { get; set; }
        [Required]
        [Column(TypeName = "image")]
        public byte[] Image { get; set; }
        [Required]
        public Guid Guid { get; set; }

        public int AlbumId { get; set; }
        public virtual Album Album { get; set; }

        public Photo()
        {
            Guid = Guid.NewGuid();
        }
    }

    public class Comment
    {
        public int Id { get; set; }
        [Required]
        public string CommentText { get; set; }
        [Required]
        public DateTime DateTime { get; set; }

        public int AlbumId { get; set; }
        public virtual Album Album { get; set; }

        public string ApplicationUserId { get; set; }
        public virtual ApplicationUser User { get; set; }

        public Comment()
        {
            DateTime = DateTime.Now;
        }
    }

    public class Rating
    {
        public int Id { get; set; }
        [Required]
        public double Rate { get; set; }

        public string ApplicationUserId { get; set; }
        public ApplicationUser User { get; set; }

        public int AlbumId { get; set; }
        public Album Album { get; set; }
    }
}