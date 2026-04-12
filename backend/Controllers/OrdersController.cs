using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Security.Claims;
namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly MarketPlaceDbContext _context;
        public OrdersController(MarketPlaceDbContext context)
        {
            _context = context;
        }
        [HttpPost("checkout")]
        public async Task<ActionResult> Checkout(CheckOutRequestDto request)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("Invalid token");
            }
            int loggedInBuyerId = int.Parse(userIdString);
            var product = await _context.Products.FindAsync(request.ProductId);
            if(product == null)
            {
                return NotFound("Product Not Found");
            }
            var newOrder = new Order
            {
                ProductId = request.ProductId,
                BuyerId = loggedInBuyerId,
                Status = "Pending"
            };
            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();
            var escrow = new EscrowTransaction
            {
                OrderId = newOrder.Id,
                Amount = product.Price,
                Status = "Held"
            };
            _context.EscrowTransactions.Add(escrow);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Message = "Checkout successfull! Money is held in Escrow",
                OrderId = newOrder.Id
            });
        }
        [HttpPost("{orderId}/confirm")]
        public async Task<ActionResult> ConfirmDelivery(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound("Order Not Found");
            var escrow = await _context.EscrowTransactions
                .FirstOrDefaultAsync(e => e.OrderId == orderId);
            if (escrow == null)
                return NotFound("Escrow record not found for this order");
            order.Status = "Delivered";
            escrow.Status = "Released";
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Message = "Delivery confirmed! Escrow funds have been released to the seller.",
                OrderStatus = order.Status,
                EscrowStatus = escrow.Status
            });
        }
        [HttpPost("{orderId}/cancel")]
        public async Task<ActionResult> CancelOrder(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if(order == null)
            {
                return NotFound("Order Not Found");
            }
            if(order.Status != "Pending")
            {
                return BadRequest("Only pending orders can be cancelled");
            }
            var escrow = await _context.EscrowTransactions
                .FirstOrDefaultAsync(e => e.OrderId == orderId);
            if(escrow == null)
            {
                return NotFound("Escrow record not found for this order");
            }
            order.Status = "Cancelled";
            escrow.Status = "Refunded";
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Message = "Order cancelled. Escrow funds have been refunded to the buyer.",
                OrderStatus = order.Status,
                EscrowStatus = escrow.Status
            });
        }
        [HttpGet("buyer/{buyerId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByBuyer(int buyerId)
        {
            var orders = await _context.Orders
                .Include(o => o.Product)
                .Where(o => o.BuyerId == buyerId)
                .ToListAsync();
            return Ok(orders);
        }
        [HttpGet("seller/{sellerId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersForSeller(int sellerId)
        {
            // Find all orders where the Product's SellerId matches this seller
            var orders = await _context.Orders
                .Include(o => o.Product)
                .Where(o => o.Product.SellerId == sellerId)
                .ToListAsync();

            return Ok(orders);
        }
        [HttpPost("create-razorpay-order")]
        public IActionResult CreateRazorPayOrder([FromBody] CheckOutRequestDto request) {
            var product = _context.Products.Find(request.ProductId);
            if (product == null) return NotFound("Product not found");
            string? keyId = Environment.GetEnvironmentVariable("Razorpay__KeyId");
            string? keySecret = Environment.GetEnvironmentVariable("Razorpay__KeySecret");
            Razorpay.Api.RazorpayClient client = new Razorpay.Api.RazorpayClient(keyId, keySecret);
            Dictionary<string, object> options = new Dictionary<string, object>();
            options.Add("amount",(int)(product.Price * 100));
            options.Add("currency","INR");
            options.Add("receipt", "receipt_" + Guid.NewGuid().ToString().Substring(0, 8));

            Razorpay.Api.Order order = client.Order.Create(options);

            return Ok(new
            {
                orderId = order["id"].ToString(),
                amount = order["amount"].ToString(),
                currency = order["currency"].ToString(),
                productName = product.Name
            });

        }
    }
}
