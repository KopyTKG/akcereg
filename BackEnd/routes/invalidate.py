from fastapi import APIRouter
from classes.server_utils import *
import requests
import os


router = APIRouter()


@router.get("/invalidate")
async def invalidate(ticket: str):
    headers = {
        "accept": "*/*",
        "Content-Type": "text/plain",
    }
    url = os.getenv("STAG_URL") + "ws/services/rest2/help/invalidateTicket?ticket=" + ticket

    response = requests.get(url, headers=headers)
    print(response)
    return 200
