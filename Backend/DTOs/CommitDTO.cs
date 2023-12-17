namespace Backend.DTOs
{
    public class CommitDTO
    {
        public string Author { get; set; } = null!;

        public DateTimeOffset Date { get; set; } = DateTime.Now;


        public string Message { get; set; } = null!;
    }
}