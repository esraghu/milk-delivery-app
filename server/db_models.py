from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    house_number = Column(String, nullable=False)
    address = Column(String)
    role = Column(String, default="resident")  # resident or delivery_person
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    subscriptions = relationship("Subscription", back_populates="user")
    orders = relationship("Order", back_populates="user")
    cancellations = relationship("Cancellation", back_populates="user")


class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    
    # Relationships
    subscription_items = relationship("SubscriptionItem", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")


class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    frequency = Column(String, default="daily")  # daily, weekly, etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")
    items = relationship("SubscriptionItem", back_populates="subscription")


class SubscriptionItem(Base):
    __tablename__ = "subscription_items"
    
    id = Column(Integer, primary_key=True, index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    
    # Relationships
    subscription = relationship("Subscription", back_populates="items")
    product = relationship("Product", back_populates="subscription_items")


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    is_adhoc = Column(Boolean, default=False)
    status = Column(String, default="pending")  # pending, delivered, cancelled
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class Vacation(Base):
    __tablename__ = "vacations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="vacations")


class Cancellation(Base):
    __tablename__ = "cancellations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cancellation_type = Column(String, nullable=False)  # "subscription", "order", "vacation"
    reference_id = Column(Integer, nullable=False)  # ID of the cancelled item
    reason = Column(Text)
    cancelled_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="cancellations")


# Add missing relationship to User
User.vacations = relationship("Vacation", back_populates="user")
