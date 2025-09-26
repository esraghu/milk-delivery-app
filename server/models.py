from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class Product(BaseModel):
    id: Optional[int] = None
    name: str
    price: float
    
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: str

class UserCreate(BaseModel):
    name: str
    email: str
    house_number: str
    address: Optional[str] = None

class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    house_number: str
    address: Optional[str] = None
    role: str = "resident"  # resident or delivery_person
    created_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class SubscriptionItemCreate(BaseModel):
    product_id: int
    quantity: int

class SubscriptionItem(BaseModel):
    id: Optional[int] = None
    product_id: int
    quantity: int
    product: Optional[Product] = None
    
    class Config:
        orm_mode = True

class SubscriptionCreate(BaseModel):
    items: List[SubscriptionItemCreate]
    frequency: str = "daily"

class Subscription(BaseModel):
    id: Optional[int] = None
    user_id: int
    frequency: str = "daily"
    is_active: bool = True
    items: Optional[List[SubscriptionItem]] = None
    created_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderItem(BaseModel):
    id: Optional[int] = None
    product_id: int
    quantity: int
    product: Optional[Product] = None
    
    class Config:
        orm_mode = True

class OrderCreate(BaseModel):
    date: date
    items: List[OrderItemCreate]
    is_adhoc: bool = False

class Order(BaseModel):
    id: Optional[int] = None
    user_id: int
    date: date
    is_adhoc: bool = False
    status: str = "pending"
    items: Optional[List[OrderItem]] = None
    created_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class VacationCreate(BaseModel):
    start_date: date
    end_date: date

class Vacation(BaseModel):
    id: Optional[int] = None
    user_id: int
    start_date: date
    end_date: date
    created_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class CancellationCreate(BaseModel):
    cancellation_type: str  # "subscription", "order", "vacation"
    reference_id: int
    reason: Optional[str] = None

class Cancellation(BaseModel):
    id: Optional[int] = None
    user_id: int
    cancellation_type: str
    reference_id: int
    reason: Optional[str] = None
    cancelled_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
