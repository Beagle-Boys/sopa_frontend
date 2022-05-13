from pydantic import BaseModel

class BasicModel(BaseModel):
    class Config:
        use_enum_values = True