namespace PhotoAlbum.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migration_2 : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Albums", new[] { "User_Id" });
            DropIndex("dbo.Comments", new[] { "User_Id" });
            DropColumn("dbo.Albums", "ApplicationUserId");
            DropColumn("dbo.Comments", "ApplicationUserId");
            RenameColumn(table: "dbo.Albums", name: "User_Id", newName: "ApplicationUserId");
            RenameColumn(table: "dbo.Comments", name: "User_Id", newName: "ApplicationUserId");
            AlterColumn("dbo.Albums", "ApplicationUserId", c => c.String(maxLength: 128));
            AlterColumn("dbo.Comments", "ApplicationUserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Albums", "ApplicationUserId");
            CreateIndex("dbo.Comments", "ApplicationUserId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Comments", new[] { "ApplicationUserId" });
            DropIndex("dbo.Albums", new[] { "ApplicationUserId" });
            AlterColumn("dbo.Comments", "ApplicationUserId", c => c.Int(nullable: false));
            AlterColumn("dbo.Albums", "ApplicationUserId", c => c.Int(nullable: false));
            RenameColumn(table: "dbo.Comments", name: "ApplicationUserId", newName: "User_Id");
            RenameColumn(table: "dbo.Albums", name: "ApplicationUserId", newName: "User_Id");
            AddColumn("dbo.Comments", "ApplicationUserId", c => c.Int(nullable: false));
            AddColumn("dbo.Albums", "ApplicationUserId", c => c.Int(nullable: false));
            CreateIndex("dbo.Comments", "User_Id");
            CreateIndex("dbo.Albums", "User_Id");
        }
    }
}
