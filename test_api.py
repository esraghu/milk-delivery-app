#!/usr/bin/env python3
"""
Simple test script to verify the API endpoints are working
Run this after starting the server to test the database integration
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_products():
    """Test products endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/products")
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Products endpoint working: {len(products)} products found")
            return True
        else:
            print(f"❌ Products endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Products endpoint error: {e}")
        return False

def test_signup():
    """Test user signup endpoint"""
    try:
        test_user = {
            "name": "Test User",
            "email": f"test_{abs(hash('test'))}@example.com",
            "house_number": "T-123",
            "address": "Test Address, Test City"
        }
        
        response = requests.post(f"{BASE_URL}/signup", json=test_user)
        if response.status_code == 200:
            user = response.json()
            print(f"✅ Signup endpoint working: User created with ID {user.get('id')}")
            return user
        else:
            print(f"❌ Signup endpoint failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Signup endpoint error: {e}")
        return None

def test_login(email):
    """Test login endpoint"""
    try:
        response = requests.post(f"{BASE_URL}/login", json={"email": email})
        if response.status_code == 200:
            user = response.json()
            print(f"✅ Login endpoint working: User {user.get('name')} logged in")
            return user
        else:
            print(f"❌ Login endpoint failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login endpoint error: {e}")
        return None

def test_user_endpoints(user_id):
    """Test user-specific endpoints"""
    try:
        # Test get user
        response = requests.get(f"{BASE_URL}/users/{user_id}")
        if response.status_code == 200:
            print("✅ Get user endpoint working")
        else:
            print(f"❌ Get user endpoint failed: {response.status_code}")
            
        # Test subscription creation
        subscription_data = {
            "items": [
                {"product_id": 1, "quantity": 2},
                {"product_id": 2, "quantity": 1}
            ],
            "frequency": "daily"
        }
        
        response = requests.post(f"{BASE_URL}/users/{user_id}/subscription", json=subscription_data)
        if response.status_code == 200:
            print("✅ Create subscription endpoint working")
        else:
            print(f"❌ Create subscription endpoint failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ User endpoints error: {e}")

def main():
    print("🧪 Testing DailyDoodh API endpoints...")
    print("=" * 50)
    
    # Test basic endpoints
    if not test_products():
        print("❌ Basic API not working. Make sure server is running on localhost:8000")
        return
    
    # Test signup
    user = test_signup()
    if user:
        # Test login with the same user
        login_user = test_login(user['email'])
        if login_user:
            test_user_endpoints(user['id'])
        else:
            test_user_endpoints(user['id'])
    
    print("=" * 50)
    print("✅ API testing completed!")

if __name__ == "__main__":
    main()
