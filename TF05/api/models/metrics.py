from pydantic import BaseModel
from typing import Optional

class ServiceMetric(BaseModel):
    service_name: str
    uptime_percentage: float
    response_time_ms: int
    status: str
