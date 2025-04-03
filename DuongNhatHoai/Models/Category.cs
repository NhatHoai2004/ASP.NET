namespace DuongNhatHoai.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation property
        public ICollection<Product> Products { get; set; }
    }
}
