using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BankMonitoringAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixSiteUserRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "ResponseTimeMs",
                table: "SSLCheckResults",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "SSLCertificates",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "unknown",
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Sites",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "unknown",
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "ResponseTimeMs",
                table: "SSLCheckResults",
                type: "integer",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "SSLCertificates",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldDefaultValue: "unknown");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Sites",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldDefaultValue: "unknown");
        }
    }
}
