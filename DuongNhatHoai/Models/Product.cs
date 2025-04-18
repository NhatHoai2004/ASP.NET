using System.Text.Json.Serialization;

namespace DuongNhatHoai.Models
{
    public class Product
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public decimal? SalePrice { get; set; }

        public int Stock { get; set; } = 0;

        public int? BrandId { get; set; }

        public int? CategoryId { get; set; }

        public string? ImageUrl { get; set; }

        public string Status { get; set; } = "Available";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public string? UpdatedBy { get; set; }

        // Tránh serialize Brand → Products → Brand vòng lặp
        [JsonIgnore]
        public Brand? Brand { get; set; }

        [JsonIgnore]
        public Category? Category { get; set; }

        [JsonIgnore]
        public ICollection<CartItem>? CartItems { get; set; }

        [JsonIgnore]
        public ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}
