namespace DuongNhatHoai.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int? OrderId { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PaymentStatus { get; set; }
        public DateTime? PaymentDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }

        public OrderTable? Order { get; set; }
    }

}
