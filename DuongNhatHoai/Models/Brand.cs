namespace DuongNhatHoai.Models
{
    public class Brand
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public string? LogoUrl { get; set; }
        public string Status { get; set; } = "Active";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }

        public ICollection<Product>? Products { get; set; }
    }

}
