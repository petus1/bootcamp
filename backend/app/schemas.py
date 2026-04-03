from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1, max_length=120)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    name: str
    avatar: str
    avatar_color: str


class MessageCreate(BaseModel):
    text: str = Field(min_length=1, max_length=4000)


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sender_id: int
    recipient_id: int
    text: str
    created_at: datetime


class ChatPreview(BaseModel):
    user_id: int
    name: str
    avatar: str
    avatar_color: str
    last_message: str
    last_message_at: datetime


class TrackingStartResponse(BaseModel):
    session_id: int


class TrackingPointIn(BaseModel):
    lat: float
    lon: float
    accuracy: float | None = None
    speed: float | None = None


class TrackingPointOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    lat: float
    lon: float
    accuracy: float | None = None
    speed: float | None = None
    created_at: datetime



class ProfilePatch(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    avatar: str | None = Field(default=None, min_length=1, max_length=8)
    avatar_color: str | None = Field(default=None, min_length=4, max_length=16)


class ProgressSummary(BaseModel):
    messages_sent: int
    points_recorded: int
