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
        /// <summary>
        /// Gets all repositories from the user
        /// </summary>
        /// <returns>
        /// the list of repositories of the user
        /// </returns>
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
        /// <summary>
        /// Gets the number of commits of a repository
        /// </summary>
        /// <param name="client">github userr</param>
        /// <param name="repoName">name of the repo that we want to count the commits from</param>
        /// <returns>
        /// number of commits of the repository
        /// </returns>
        private async Task<int> GetCommitsAmountByRepository(GitHubClient client, string repoName)
        {
            var commits = await client.Repository.Commit.GetAll("Dizkm8", repoName);
            if (commits is null) return 0;

            return commits.Count;
        }

        /// <summary>
        /// Gets all the commits from a repository
        /// </summary>
        /// <param name="repositoryName">new of the repository that we want to get the commits from</param>
        /// <returns>
        /// the list of commits of the repository
        /// </returns>

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