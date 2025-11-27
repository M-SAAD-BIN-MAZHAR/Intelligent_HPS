"""
PostgreSQL Database Connection and Models for Healthcare Application
Uses the same database as the Streamlit application
"""
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from typing import Optional, Dict
from passlib.context import CryptContext
from datetime import datetime

# Database Configuration (same as Streamlit project)
DB_CONFIG = {
    'database': 'HMS_DATABASE',
    'user': 'postgres',
    'password': '1234',
    'host': 'localhost',
    'port': '5432'
}

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        yield conn
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def get_user_by_email(email: str) -> Optional[Dict]:
    """Get user by email from database"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as curr:
            curr.execute(
                "SELECT * FROM PATIENT_DATA WHERE Email = %s",
                (email,)
            )
            user = curr.fetchone()
            return dict(user) if user else None

def get_user_by_patient_id(patient_id: str) -> Optional[Dict]:
    """Get user by patient ID from database"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as curr:
            curr.execute(
                "SELECT * FROM PATIENT_DATA WHERE Patient_ID = %s",
                (int(patient_id),)
            )
            user = curr.fetchone()
            return dict(user) if user else None

def authenticate_user(email: str, password: str) -> Optional[Dict]:
    """
    Authenticate user with email and password
    Returns user data if authentication successful, None otherwise
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as curr:
            # Get user by email
            curr.execute(
                "SELECT * FROM PATIENT_DATA WHERE Email = %s",
                (email,)
            )
            user = curr.fetchone()
            
            if not user:
                return None
            
            # Check if password matches (plain text comparison for now, matching Streamlit)
            # Note: In production, you should use hashed passwords
            if user['password'] == password:
                return dict(user)
            
            return None

def create_user(
    patient_id: str,
    first_name: str,
    last_name: str,
    email: str,
    phone: str,
    address: str,
    emergency_contact: str,
    date_of_birth: str,
    gender: str,
    blood_type: str,
    password: str
) -> bool:
    """
    Create a new user in the database
    Returns True if successful, False otherwise
    """
    try:
        with get_db_connection() as conn:
            with conn.cursor() as curr:
                insert_query = """
                    INSERT INTO PATIENT_DATA 
                    (Patient_ID, First_Name, Last_Name, Email, Phone, Home_Address, 
                     Emergency_Contact, Date_of_Birth, Gender, Blood_Type, Password)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                curr.execute(
                    insert_query,
                    (
                        int(patient_id),
                        first_name,
                        last_name,
                        email,
                        phone,
                        address,
                        emergency_contact,
                        date_of_birth,
                        gender,
                        blood_type,
                        password  # Storing plain text to match Streamlit (not recommended for production)
                    )
                )
                return True
    except psycopg2.IntegrityError as e:
        # Duplicate email or patient_id
        print(f"Database integrity error: {e}")
        return False
    except Exception as e:
        print(f"Database error: {e}")
        return False

def check_database_connection() -> bool:
    """Check if database connection is working"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as curr:
                curr.execute("SELECT 1")
                return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

def ensure_table_exists():
    """Ensure the PATIENT_DATA table exists"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as curr:
                create_table_query = """
                CREATE TABLE IF NOT EXISTS PATIENT_DATA (
                    Patient_ID INTEGER PRIMARY KEY,
                    First_Name VARCHAR(50),
                    Last_Name VARCHAR(50),
                    Email VARCHAR(100) UNIQUE,
                    Phone VARCHAR(15),
                    Home_Address TEXT,
                    Emergency_Contact VARCHAR(15),
                    Date_of_Birth DATE,
                    Gender VARCHAR(10),
                    Blood_Type VARCHAR(10),
                    Password VARCHAR(255)
                )
                """
                curr.execute(create_table_query)
                print("✓ Database table verified/created")
                return True
    except Exception as e:
        print(f"✗ Failed to create table: {e}")
        return False

# Initialize database on module import
if __name__ != "__main__":
    try:
        ensure_table_exists()
        if check_database_connection():
            print("✓ PostgreSQL database connected successfully")
        else:
            print("✗ PostgreSQL database connection failed")
    except Exception as e:
        print(f"✗ Database initialization error: {e}")
