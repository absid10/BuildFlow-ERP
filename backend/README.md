# BuildFlow ERP — Backend

## Setup
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Environment
Copy `.env.example` to `.env` and configure your PostgreSQL connection.

## Run
```bash
uvicorn app.main:app --reload --port 8000
```

## Migrations
```bash
alembic upgrade head
```
