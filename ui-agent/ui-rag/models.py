from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    orders = relationship("Order", back_populates="owner")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_name = Column(String)
    amount = Column(Float)
    status = Column(String, default="pending") # pending, paid, failed
    fedapay_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="orders")

class GenerationSession(Base):
    __tablename__ = "generation_sessions"
    
    id = Column(String, primary_key=True, index=True)
    url = Column(String)
    status = Column(String, default="starting")
    progress = Column(Integer, default=0)
    result_url = Column(String, nullable=True)
    product_name = Column(String, nullable=True)
    logs = Column(String, default="[]")
    opencode_session_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
