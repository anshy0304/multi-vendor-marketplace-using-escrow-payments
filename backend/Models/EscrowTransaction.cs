namespace backend.Models
{
    public class EscrowTransaction
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order? Order { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = "Held";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
