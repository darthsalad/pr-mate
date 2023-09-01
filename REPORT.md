# Project Report 

> Project: `pr-mate`

## Approach
The approach for this project was rooted in the understanding of the requirements 
and the scope of the project. The aim was to develop a `GitHub App` that listens to 
pull request creation events and responds with comments based on specific commands. 
The two primary features were code execution using the `Piston API` and code explanation 
using the `OpenAI API`. 

The Project was made using Probot using a TypeScript template. The project was
developed using the `GitHub Flow` methodology. The project was developed in a
series of steps, each step building on the previous one. The steps were as follows:
- Setting up the project and environment variables
- Setting up the `Piston API` and `OpenAI API` and abstracting them in different files
- Setting up the `on` listeners for `reviewCommentCreation` and `pullRequestCreation`
- Responding with comments based on the given commands

## Challenges Faced
The main challenge faced during the project were 
- The lack of examples for
a Probot app that achieved similar functionality. This meant that the project
had to be developed from scratch, and the documentation had to be referred to
for every step. This was a time-consuming process, but it helped in understanding
the Probot framework better. 
- Another one was integrating the `Open AI API` with
the project. The API had limited free usage, and the API key and the model used was 
not very accurate. This meant that the responses were not always accurate.

## Improvement/Future Scopes
- The project's success could be improved with better scope management. 
- A better LLM could be used for the `OpenAI API` to improve the accuracy of the responses.
- The project could be expanded to support more commands and integrate with more APIs. This would require careful planning and scope management. 
- Additionally, to avoid ambiguity, the scope needs to be clear and to the point. Incomplete scope leads to schedule slips and hence finally cost overrun. To avoid this, the scope needs to be complete and accurate projectsmart.co.uk.

## Conclusion
The base features were implemented successfully. The project
was developed using the `GitHub Flow` includind best code practices and testing.

Overall, it was a learning experience, and the project was a success.