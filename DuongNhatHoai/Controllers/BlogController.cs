using Microsoft.AspNetCore.Mvc;
using DuongNhatHoai.Models;
using DuongNhatHoai.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DuongNhatHoai.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Blog
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Blog>>> GetBlogs()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("Chưa đăng nhập.");
            }

            var blogs = await _context.Blogs.ToListAsync();
            return Ok(blogs);
        }

        // GET: api/Blog/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Blog>> GetBlog(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("Chưa đăng nhập.");
            }

            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
                return NotFound();
            return Ok(blog);
        }

        // POST: api/Blog
        [HttpPost]
        public async Task<IActionResult> PostBlog([FromBody] Blog blog)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("Chưa đăng nhập.");
            }

            blog.CreatedAt = DateTime.UtcNow;
            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, blog);
        }

        // PUT: api/Blog/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBlog(int id, [FromBody] Blog updatedBlog)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("Chưa đăng nhập.");
            }

            var existingBlog = await _context.Blogs.FindAsync(id);
            if (existingBlog == null)
                return NotFound();

            existingBlog.Title = updatedBlog.Title;
            existingBlog.Content = updatedBlog.Content;
            existingBlog.ImageUrl = updatedBlog.ImageUrl;
            existingBlog.Status = updatedBlog.Status;
            existingBlog.UpdatedAt = DateTime.UtcNow;
            existingBlog.UpdatedBy = updatedBlog.UpdatedBy;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Blog/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("Chưa đăng nhập.");
            }

            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
                return NotFound();

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
