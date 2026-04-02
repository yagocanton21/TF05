from pydantic import BaseModel
from typing import Optional

class AlertData(BaseModel):
    service: str
    level: str  # warning, critical
    message: str
    timestamp: str
