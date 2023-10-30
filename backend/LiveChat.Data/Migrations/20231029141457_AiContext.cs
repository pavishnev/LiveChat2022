using Microsoft.EntityFrameworkCore.Migrations;

namespace LiveChat.Data.Migrations
{
    public partial class AiContext : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AiContext",
                table: "Websites",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AiContext",
                table: "Websites");
        }
    }
}
