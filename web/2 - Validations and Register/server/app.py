"""
In this version we use both Pydantic and SQLAlchemy:

    1.Pydantic: For defining, parsing and validating data exposed by the
    Web API

    2. SQLAlchemy: To define and use the SQL data model.

In the next version we'll use SQLModel to bridge the gap between Pydantic
and SQLAlchemy.

We'll also use the common layering and file structure recommend for FastAPI
and Flask apps:

    - schemas.py: Pydantic models/schemas
    - models.py: SQLAlchemy models (the data model)
    - database.py: SQLAlchemy connection and session definitions
    - database_crud.py: SQLAlchemy database acess operations

Links:
    https://fastapi.tiangolo.com/tutorial/sql-databases/
    https://docs.sqlalchemy.org/en/14/orm/quickstart.html
    https://docs.sqlalchemy.org/en/14/orm/
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import schemas as sch
from schemas import ErrorCode

app = FastAPI()

origins = [
    "https://127.0.0.1.5500",
    "https://127.0.0.1.5501",
    "https://127.0.0.1.8000",
]

#https://fastapi.tiangolo.com/tutorial/cors

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

@app.post('/register')
async def register(player: sch.PlayerRegister) -> sch.PlayerRegisterResult:
    tourn_id = player.tournament_id
    if tourn_id is None:
        error = ErrorCode.ERR_UNSPECIFIED_TOURNAMENT
        raise HTTPException(status_code = 400, detail = error.details())

    if tourn_id not in (1, 2, 3):
        error = ErrorCode.ERR_UNSPECIFIED_TOURNAMENT_ID
        raise HTTPException(status_code = 404, detail = error.details(id = tourn_id))

    return sch.PlayerRegisterResult(
        id = 1105, 
        full_name = player.full_name,
        email = player.email,
    )
#:

##################################################################

def main():
    import uvicorn
    from docopt import docopt
    help_doc = """

A Web accesible FastAPI server that allow players to register/enroll
for tournaments.

Usage:
    app.py [-c | -c -d] [-p PORT] [-h HOST_IP]
 
Options:
    -p PORT, --port=PORT                Listen on this port [default: 8000]
    -c, --create-ddl                    Create datamodels in the database
    -d, --populate-db                   Populate the DB with dummy for testing purposes
    -h HOST_IP, --host=HOST_IP          Listen on this IP adress [default: 127.0.0.1]
"""
    args = docopt(help_doc)
    create_ddl = args['--create-ddl']
    populate_db = args['--populate-db']
    if create_ddl:
        print("Will create ddl")
        if populate_db:
            print("Will also populate the DB")
        #:
    #:

    uvicorn.run(
        'app:app', 
        port = int(args['--port']),
        host = args['--host'],
        reload = True,
    )
#:

if __name__=='__main__':
    main()
#: