import uvicorn, os, dotenv
from fastapi import FastAPI # type: ignore
from classes.server_utils import *
from lib.db_utils import *
from lib.conn import session

from routes.setup import router as kontrola_s_db
from routes.ucitel import ucitel_routers
from routes.student import student_routers
from routes.admin import admin_routers
from routes.predmety import router as predmety

dotenv.load_dotenv()

app = FastAPI(debug=True)

#Poznámka:
    # pokud přidávám novou route, importím do __init__.py nadřazeného adresáře


# General Routers
app.include_router(kontrola_s_db)
app.include_router(predmety)

# Student Endpoints
for router in student_routers:
    app.include_router(router)

# Ucitel Endpoints
for router in ucitel_routers:
    app.include_router(router)

# Admin Endpoints
for router in admin_routers:
    app.include_router(router)


if __name__ == "__main__":
    dotenv.load_dotenv()

    if not session:
        raise Exception("Session creation failed!")
    vyucujici_k_predmetum_to_txt(session)

    uvicorn.run(app, host=os.getenv('HOST'), port=int(os.getenv('PORT'))) # type: ignore

