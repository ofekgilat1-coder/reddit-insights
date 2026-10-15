from fastapi import FastAPI

app = FastAPI(title="Reddit Insights API")


@app.get("/users/{username}")
def get_user_name(username : str):
    return {"username": username}

@app.get("/health")
def health_check():
    return {"status": "ok"}