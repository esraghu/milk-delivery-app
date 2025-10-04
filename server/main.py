from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from database import engine, get_db
from db_models import Base, User as DBUser, Product as DBProduct, Subscription as DBSubscription,     SubscriptionItem as DBSubscriptionItem, Order as DBOrder, OrderItem as DBOrderItem,     Vacation as DBVacation, Cancellation as DBCancellation
from models import (
    User, UserLogin, UserCreate, Product, Subscription, SubscriptionCreate, 
    Order, OrderCreate, Vacation, VacationCreate, Cancellation, CancellationCreate
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Initialize database with sample data
def init_db():
    db = next(get_db())
    
    # Check if data already exists
    if db.query(DBProduct).count() > 0:
        return
    
    # Add sample products
    products = [
        DBProduct(name="Milk", price=25.0),
        DBProduct(name="Curd", price=15.0),
        DBProduct(name="Butter", price=45.0),
        DBProduct(name="Cheese", price=80.0)
    ]
    
    for product in products:
        db.add(product)
    
    db.commit()
    db.close()

# Initialize database on startup
init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to DailyDoodh API"}

# User login endpoint
@app.post("/login", response_model=User)
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(DBUser).filter(DBUser.email == login_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# User signup endpoint
@app.post("/signup", response_model=User)
def signup_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(DBUser).filter(DBUser.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    db_user = DBUser(**user_data.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Delivery person signup endpoint
@app.post("/signup-delivery", response_model=User)
def signup_delivery_person(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(DBUser).filter(DBUser.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new delivery person
    db_user = DBUser(**user_data.dict(), role="delivery_person")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Product endpoints
@app.get("/products", response_model=List[Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(DBProduct).all()

@app.post("/products", response_model=Product)
def create_product(product: Product, db: Session = Depends(get_db)):
    db_product = DBProduct(**product.dict(exclude={'id'}))
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# User endpoints
@app.get("/users", response_model=List[User])
def get_users(db: Session = Depends(get_db)):
    return db.query(DBUser).all()

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Subscription endpoints
@app.get("/users/{user_id}/subscription", response_model=Subscription)
def get_subscription(user_id: int, db: Session = Depends(get_db)):
    subscription = db.query(DBSubscription).filter(
        DBSubscription.user_id == user_id, 
        DBSubscription.is_active == True
    ).first()
    if subscription is None:
        raise HTTPException(status_code=404, detail="Active subscription not found")
    
    # Load subscription items
    subscription.items = db.query(DBSubscriptionItem).filter(
        DBSubscriptionItem.subscription_id == subscription.id
    ).all()
    
    return subscription

@app.post("/users/{user_id}/subscription", response_model=Subscription)
def create_or_update_subscription(user_id: int, subscription_data: SubscriptionCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Deactivate existing subscription
    existing_subscription = db.query(DBSubscription).filter(
        DBSubscription.user_id == user_id, 
        DBSubscription.is_active == True
    ).first()
    if existing_subscription:
        existing_subscription.is_active = False
    
    # Create new subscription
    db_subscription = DBSubscription(
        user_id=user_id,
        frequency=subscription_data.frequency
    )
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    
    # Add subscription items
    for item_data in subscription_data.items:
        db_item = DBSubscriptionItem(
            subscription_id=db_subscription.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity
        )
        db.add(db_item)
    
    db.commit()
    
    # Load subscription items for response
    db_subscription.items = db.query(DBSubscriptionItem).filter(
        DBSubscriptionItem.subscription_id == db_subscription.id
    ).all()
    
    return db_subscription

# Vacation endpoints
@app.get("/users/{user_id}/vacations", response_model=List[Vacation])
def get_vacations(user_id: int, db: Session = Depends(get_db)):
    return db.query(DBVacation).filter(DBVacation.user_id == user_id).all()

@app.post("/users/{user_id}/vacations", response_model=Vacation)
def add_vacation(user_id: int, vacation_data: VacationCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_vacation = DBVacation(
        user_id=user_id,
        start_date=vacation_data.start_date,
        end_date=vacation_data.end_date
    )
    db.add(db_vacation)
    db.commit()
    db.refresh(db_vacation)
    return db_vacation

# Order endpoints
@app.get("/users/{user_id}/orders", response_model=List[Order])
def get_orders(user_id: int, db: Session = Depends(get_db)):
    return db.query(DBOrder).filter(DBOrder.user_id == user_id).all()

@app.post("/users/{user_id}/orders", response_model=Order)
def create_adhoc_order(user_id: int, order_data: OrderCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_order = DBOrder(
        user_id=user_id,
        date=order_data.date,
        is_adhoc=order_data.is_adhoc
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Add order items
    for item_data in order_data.items:
        db_item = DBOrderItem(
            order_id=db_order.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity
        )
        db.add(db_item)
    
    db.commit()
    return db_order

# Cancellation endpoints
@app.get("/users/{user_id}/cancellations", response_model=List[Cancellation])
def get_cancellations(user_id: int, db: Session = Depends(get_db)):
    return db.query(DBCancellation).filter(DBCancellation.user_id == user_id).all()

@app.post("/users/{user_id}/cancellations", response_model=Cancellation)
def create_cancellation(user_id: int, cancellation_data: CancellationCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_cancellation = DBCancellation(
        user_id=user_id,
        cancellation_type=cancellation_data.cancellation_type,
        reference_id=cancellation_data.reference_id,
        reason=cancellation_data.reason
    )
    db.add(db_cancellation)
    db.commit()
    db.refresh(db_cancellation)
    return db_cancellation

# Delivery endpoints
@app.get("/deliveries/{delivery_date}")
def get_daily_deliveries(delivery_date: date, db: Session = Depends(get_db)):
    deliveries = []
    
    # Get all active subscriptions
    subscriptions = db.query(DBSubscription).filter(DBSubscription.is_active == True).all()
    
    for subscription in subscriptions:
        # Check if user is on vacation
        vacation = db.query(DBVacation).filter(
            DBVacation.user_id == subscription.user_id,
            DBVacation.start_date <= delivery_date,
            DBVacation.end_date >= delivery_date
        ).first()
        
        if not vacation:  # User is not on vacation
            # Get subscription items
            subscription_items = db.query(DBSubscriptionItem).filter(
                DBSubscriptionItem.subscription_id == subscription.id
            ).all()
            
            if subscription_items:
                delivery_order = {
                    "user_id": subscription.user_id,
                    "date": delivery_date,
                    "items": [{
                        "product_id": item.product_id,
                        "quantity": item.quantity
                    } for item in subscription_items],
                    "is_subscription": True
                }
                deliveries.append(delivery_order)
    
    # Add ad-hoc orders for the day
    adhoc_orders = db.query(DBOrder).filter(
        DBOrder.date == delivery_date,
        DBOrder.is_adhoc == True
    ).all()
    
    for order in adhoc_orders:
        order_items = db.query(DBOrderItem).filter(DBOrderItem.order_id == order.id).all()
        delivery_order = {
            "user_id": order.user_id,
            "date": delivery_date,
            "items": [{
                "product_id": item.product_id,
                "quantity": item.quantity
            } for item in order_items],
            "is_subscription": False,
            "is_adhoc": True
        }
        deliveries.append(delivery_order)
    
    return deliveries
