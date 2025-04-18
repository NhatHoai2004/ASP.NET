using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DuongNhatHoai.Data;
using DuongNhatHoai.Models;
using Microsoft.AspNetCore.Authorization;

namespace DuongNhatHoai.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BrandController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Brand
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Brand>>> GetBrands()
        {
            return await _context.Brands.ToListAsync();
        }

        // GET: api/Brand/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Brand>> GetBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound();

            return brand;
        }

        // POST: api/Brand
        [HttpPost]
        public async Task<ActionResult<Brand>> PostBrand([FromBody] Brand brand)
        {
            brand.CreatedAt = DateTime.UtcNow;
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBrand), new { id = brand.Id }, brand);
        }

        // PUT: api/Brand/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBrand(int id, [FromBody] Brand updatedBrand)
        {
            var existingBrand = await _context.Brands.FindAsync(id);
            if (existingBrand == null)
                return NotFound();

            existingBrand.Name = updatedBrand.Name;
            existingBrand.LogoUrl = updatedBrand.LogoUrl;
            existingBrand.Status = updatedBrand.Status;
            existingBrand.UpdatedAt = DateTime.UtcNow;
            existingBrand.UpdatedBy = updatedBrand.UpdatedBy;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Brand/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound();

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
