## THIS BRANCH IS NOT TO BE MERGED.


> OpenPromptBank is an AI prompt library platform where users can explore, rank, and contribute AI prompts categorized by various topics. This platform features a searchable library, community-driven rankings, prompt performance benchmarks, and user profiles. The backend is powered by Django, Django REST Framework (DRF), and PostgreSQL, with Docker used for containerization.

---

### This branch is an overhaul of OpenPrompt/main
The server and client now run in the same environment, but maintain its' security. This overhaul uses TypeScript for its' backend in place of Python.
There are several reasons why this is a better option
- Costs can be cut, no need to run on an additional server
- Developer experience is improved
- Latency between server and API is reduced
- Codebase is now unified
- Is more scalable
- No CORS issues

Those are the main reasons.

---

Internationalization is implemented, french is now a supported language. Authentication will be overhauled soon too.