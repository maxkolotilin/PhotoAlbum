namespace PhotoAlbum.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migration_21 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Albums", "IsPrivate", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Albums", "IsPrivate");
        }
    }
}
