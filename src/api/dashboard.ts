import axios from "axios";

export const getGithubReadmeAPI = (github_username: string) => {
  return axios({
    url: `https://cdn.jsdelivr.net/gh/${github_username}/${github_username}/README.md`,
    method: "get",
  });
};
