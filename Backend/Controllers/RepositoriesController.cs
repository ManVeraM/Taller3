using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Octokit;
using DotNetEnv;

namespace MobileHub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RepositoriesController : ControllerBase
    {
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RepositoryDto>>> GetAll()
        {
            var client = new GitHubClient(new ProductHeaderValue("MobileHub"));
            var myToken = Env.GetString("GITHUB_TOKEN_ACCESS");
            var tokenCred = new Credentials(myToken);
            client.Credentials = tokenCred;

            var repositories = await client.Repository.GetAllForUser("Dizkm8");

            repositories = repositories.OrderByDescending(x => x.UpdatedAt).ToList();

            var getCommitsTasks = repositories.Select(r => GetCommitsAmountByRepository(client, r.Name));

            var commitsResults = await Task.WhenAll(getCommitsTasks);

            var mappedRepositories = repositories.Select((r, index) =>
            {
                var entity = new RepositoryDto
                {
                    Name = r.Name,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    CommitsAmount = commitsResults[index]
                };
                return entity;
            });

            return Ok(mappedRepositories);
        }

        private async Task<int> GetCommitsAmountByRepository(GitHubClient client, string repoName)
        {
            var commits = await client.Repository.Commit.GetAll("Dizkm8", repoName);
            if (commits is null) return 0;

            return commits.Count;
        }

        [HttpGet("commits/{repositoryName}")]
        public async Task<ActionResult<IEnumerable<CommitDTO>>> GetUserCommits(string repositoryName)
        {
            var client = new GitHubClient(new ProductHeaderValue("MobileHub"));
            var myToken = Env.GetString("GITHUB_TOKEN_ACCESS");
            var tokenCred = new Credentials(myToken);
            client.Credentials = tokenCred;

            var commits = await client.Repository.Commit.GetAll("Dizkm8", repositoryName);
            
            var mappedCommits = commits.Select(c => new CommitDTO
            {
                Author = c.Author.Login,
                Date = c.Commit.Author.Date,
                Message = c.Commit.Message
            });
            return Ok(mappedCommits);
        }

    }
}