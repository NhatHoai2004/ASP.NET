using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DuongNhatHoai.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        public string? Phone { get; set; }
        public string? Address { get; set; }

        [Required]
        public string Role { get; set; } = "Customer";

        [Required]
        public string Status { get; set; } = "Active";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }

        public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();
        public virtual ICollection<OrderTable> Orders { get; set; } = new List<OrderTable>();
    }
}
